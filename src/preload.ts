import path from "node:path";
import { contextBridge } from "electron";
import moment from "moment";

console.log("Preload script loaded");

const PROJECTS_PATH = path.join(
	process.env.HOME || process.env.USERPROFILE || "~/",
	"projects",
);

type Technology = {
	id: string;
	name: string;
	documentationURL: string | null;
	includeFiles: string[];
};

enum GitStatus {
	Unavailable,
	Commited,
	Uncommited,
}

type Project = {
	dirname: string;
	description: string;
	path: string;
	technologies: Technology[];
	lastEdited: string;
	gitStatus: GitStatus;
};

const TECHNOLOGIES: Technology[] = [
	{
		name: "Next.js",
		id: "nextjs",
		documentationURL: "https://nextjs.org/docs",
		includeFiles: ["next.config.js", 'package.json:"next"'],
	},
	{
		name: "React",
		id: "reactjs",
		documentationURL: "https://reactjs.org/docs/getting-started.html",
		includeFiles: ['package.json:"react"'],
	},
];

contextBridge.exposeInMainWorld("electronAPI", {
	projects: () =>
		[
			{
				path: path.join(PROJECTS_PATH, "nextjs-app"),
				technologies: [TECHNOLOGIES[0], TECHNOLOGIES[1]],
				lastEdited: moment().toISOString(),
				gitStatus: GitStatus.Commited,
			},
			{
				path: path.join(PROJECTS_PATH, "react-app"),
				technologies: [TECHNOLOGIES[1]],
				lastEdited: moment().toISOString(),
				gitStatus: GitStatus.Unavailable,
			},
		] as Project[],
});
