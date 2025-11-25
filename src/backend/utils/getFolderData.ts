import fs from "node:fs";
import path from "node:path";

const PROJECTS_PATH = path.join(
	process.env.HOME || process.env.USERPROFILE || "~/",
	"projects",
);

enum GitStatus {
	Unavailable,
	Commited,
	Uncommited,
}

type Technology = {
	id: string;
	name: string;
	documentationURL: string | null;
	includePaths: string[];
	blacklistedFilenames: string[];
	weight: number;
};

type Project = {
	path: string;
	technologies: Technology[];
	lastEdited: string;
	gitStatus: GitStatus;
};

const TECHNOLOGIES: readonly Technology[] = Object.freeze([
	{
		id: "nextjs",
		name: "Next.js",
		documentationURL: "https://nextjs.org/docs",
		includePaths: [
			"next.config.js",
			'package.json:"next"\\s*:\\s*"(?:\\^|~)[^"]+"',
		],
		blacklistedFilenames: [],
		weight: 3,
	},
	{
		id: "reactjs",
		name: "React",
		documentationURL: "https://reactjs.org/docs/getting-started.html",
		includePaths: ['package.json:"react"\\s*:\\s*"(?:\\^|~)[^"]+"'],
		blacklistedFilenames: [],
		weight: 2,
	},
	{
		id: "javascript",
		name: "JavaScript",
		documentationURL: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
		includePaths: ["*.js"],
		blacklistedFilenames: ["node_modules"],
		weight: 0,
	},
]);

function recLsDir(dirname: string, tech: Technology) {
	const found: string[] = [];

	for (const filename of fs.readdirSync(dirname)) {
		if (tech.blacklistedFilenames.includes(filename)) continue;
		const _path = path.join(dirname, filename);

		if (fs.statSync(_path).isDirectory()) {
			found.push(...recLsDir(_path, tech));
		} else {
			found.push(_path);
		}
	}

	return found;
}

export default function getFolderData(dirname: string): Project | null {
	const _path = path.join(PROJECTS_PATH, dirname);
	const lastEdited = fs.statSync(_path).mtime.toISOString();

	if (!fs.existsSync(_path) || !fs.statSync(_path).isDirectory()) return null;

	let gitStatus: GitStatus = GitStatus.Unavailable;

	if (fs.existsSync(path.join(_path, ".git"))) {
		gitStatus = GitStatus.Commited;
	}

	const techs: Technology[] = [];
	const excludedTechs: Technology[] = [];

	for (const tech of TECHNOLOGIES) {
		const hasIncludedFile = tech.includePaths.some((p) => {
			const [filename] = p.split(":");
			let exists = fs.existsSync(path.join(_path, p));

			if (filename.includes("*")) {
				const regStr = filename
					.replace(/[.+?^${}()|[\]\\]/g, "\\$&")
					.replace(/\*/g, "(.*)");

				const reg = new RegExp(`^${regStr}$`);
				const files = recLsDir(_path, tech);

				exists = files.some((f) => reg.test(f));
			}

			if (!exists || !p.includes(":")) return exists;

			const regStr = _path.substring(_path.indexOf(":") + 1);
			const reg = new RegExp(regStr);
			const content = fs.readFileSync(path.join(_path, p), "utf8");
			return reg.test(content);
		});

		if (hasIncludedFile) techs.push(tech);
		else excludedTechs.push(tech);
	}

	return {
		path: _path,
		technologies: techs,
		lastEdited: lastEdited,
		gitStatus: gitStatus,
	};
}
