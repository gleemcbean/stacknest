import fs from "node:fs";
import path from "node:path";
import { contextBridge, shell } from "electron";
import getProgram from "./backend/utils/getProgram";
import { PROGRAMS_PATH } from "./constants/Global";

contextBridge.exposeInMainWorld("electronAPI", {
	projects: () => fs.readdirSync(PROGRAMS_PATH).map(getProgram),
	revealProject: (projectName: string) => {
		const projectPath = path.resolve(PROGRAMS_PATH, projectName);

		if (/\.{2}|[/\\]/.test(projectPath)) {
			console.warn("Invalid project name.");
			return;
		}

		if (
			!fs.existsSync(projectPath) ||
			!fs.lstatSync(projectPath).isDirectory()
		) {
			console.warn("Project folder does not exist.");
			return;
		}

		shell.showItemInFolder(projectPath);
	},
});
