import fs from "node:fs";
import path from "node:path";

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

export default function getGitStatus(repoPath: string): GitStatus {
	const git = path.join(repoPath, ".git");
	if (!fs.existsSync(git)) return GitStatus.UNKNOWN;

	if (fs.existsSync(path.join(git, "MERGE_HEAD"))) {
		return GitStatus.MERGING;
	}

	if (
		fs.existsSync(path.join(git, "rebase-apply")) ||
		fs.existsSync(path.join(git, "rebase-merge"))
	) {
		return GitStatus.REBASING;
	}

	const headPath = path.join(git, "HEAD");
	if (fs.existsSync(headPath)) {
		const headContent = fs.readFileSync(headPath, "utf8").trim();
		if (!headContent.startsWith("ref:")) {
			return GitStatus.DETACHED;
		}
	}

	const workingFiles = walkFiles(repoPath);
	const trackedFiles = extractTrackedFiles(git);

	const untracked = workingFiles.filter((f) => !trackedFiles.includes(f));
	if (untracked.length > 0) {
		return GitStatus.UNTRACKED;
	}

	const modified = getModifiedFiles(repoPath, git);
	const staged = getStagedFiles(git);

	if (staged.length > 0) return GitStatus.STAGED;
	if (modified.length > 0) return GitStatus.MODIFIED;

	return GitStatus.CLEAN;
}

function walkFiles(root: string): string[] {
	const results: string[] = [];
	function walk(dir: string) {
		const files = fs.readdirSync(dir);
		for (const f of files) {
			if (f === ".git") continue;
			const full = path.join(dir, f);
			const stat = fs.statSync(full);

			if (stat.isDirectory()) walk(full);
			else results.push(path.relative(root, full));
		}
	}
	walk(root);
	return results;
}

function extractTrackedFiles(gitDir: string): string[] {
	const indexPath = path.join(gitDir, "index");
	if (!fs.existsSync(indexPath)) return [];

	const buffer = fs.readFileSync(indexPath);
	const entries: string[] = [];

	let offset = 12;

	while (offset < buffer.length) {
		offset += 40;

		offset += 20;

		const flags = buffer.readUInt16BE(offset);
		offset += 2;

		const nameLength = flags & 0x0fff;

		const name = buffer.slice(offset, offset + nameLength).toString();
		entries.push(name);
		offset += nameLength;

		while (offset % 8 !== 0) offset++;
	}

	return entries;
}

function getStagedFiles(gitDir: string): string[] {
	const indexPath = path.join(gitDir, "index");
	if (!fs.existsSync(indexPath)) return [];
	return extractTrackedFiles(gitDir);
}

function getModifiedFiles(repo: string, gitDir: string): string[] {
	const tracked = extractTrackedFiles(gitDir);
	const modified: string[] = [];

	for (const file of tracked) {
		const fullPath = path.join(repo, file);
		if (!fs.existsSync(fullPath)) continue;

		const stat = fs.statSync(fullPath);
		if (stat.mtimeMs > stat.ctimeMs + 5) {
			modified.push(file);
		}
	}

	return modified;
}
