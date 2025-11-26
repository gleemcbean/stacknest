import fs from "node:fs";
import path from "node:path";
import { PROGRAMS_PATH } from "../../constants/Global";
import Technologies from "../../constants/Technologies";
import getGitStatus from "./getGitStatus";

function recLsDir(dirname: string, blacklist: string[]) {
	const found: string[] = [];

	for (const filename of fs.readdirSync(dirname)) {
		if (blacklist.includes(filename)) continue;
		const _path = path.join(dirname, filename);

		if (fs.statSync(_path).isDirectory()) {
			found.push(...recLsDir(_path, blacklist));
		} else {
			found.push(_path);
		}
	}

	return found;
}

export default function getFolderData(dirname: string): Program | null {
	const _path = path.join(PROGRAMS_PATH, dirname);
	const lastEdited = fs.statSync(_path).mtime.toISOString();

	if (!fs.existsSync(_path) || !fs.statSync(_path).isDirectory()) return null;

	const gitStatus = getGitStatus(_path);
	const technologies: Technology[] = [];
	const blacklist: string[] = [];

	for (const tech of Technologies.toSorted((a, b) => b.weight - a.weight)) {
		const hasIncludedFile = tech.includePaths.some((p) => {
			const [filename] = p.split(":");
			let exists = fs.existsSync(path.join(_path, p));

			if (filename.includes("*")) {
				const regStr = filename
					.replace(/[.+?^${}()|[\]\\]/g, "\\$&")
					.replace(/\*/g, "(.*)");

				const reg = new RegExp(`^${regStr}$`);
				const files = recLsDir(_path, [
					...blacklist,
					...tech.blacklistedFilenames,
				]);

				exists = files.some((f) => reg.test(f));
			}

			if (!exists || !p.includes(":")) return exists;

			const regStr = _path.substring(_path.indexOf(":") + 1);
			const reg = new RegExp(regStr);
			const content = fs.readFileSync(path.join(_path, p), "utf8");
			exists = reg.test(content);
			return exists;
		});

		if (hasIncludedFile) {
			technologies.push(tech);
			blacklist.push(...tech.blacklistedFilenames);
		}
	}

	return { path: _path, dirname, technologies, lastEdited, gitStatus };
}
