import os from "node:os";
import path from "node:path";

export const PROGRAMS_PATH = path.join(os.homedir(), "Programs");

export enum GitStatus {
	CLEAN = "CLEAN",
	MODIFIED = "MODIFIED",
	STAGED = "STAGED",
	UNTRACKED = "UNTRACKED",
	MERGING = "MERGING",
	REBASING = "REBASING",
	DETACHED = "DETACHED",
	UNKNOWN = "UNKNOWN",
}
