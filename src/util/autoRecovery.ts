import fs from "fs/promises";
import kleur from "kleur";
import os from "os";
import path from "path";
import { PLACEFILE_NAME, RECOVERY_DIR_NAME, RECOVERY_KEEP_COUNT } from "../constants";
import { cmd } from "./cmd";
import { runPlatform } from "./runPlatform";

export const AUTO_RECOVERY_MODES = ["move", "delete", "keep"] as const;
export type AutoRecoveryMode = (typeof AUTO_RECOVERY_MODES)[number];

// autosave timestamps can be slightly behind the lockfile on some filesystems
const MTIME_SLACK_MS = 2000;

const RETRY_COUNT = 20;
const RETRY_DELAY_MS = 250;

const PLACE_NAME = path.basename(PLACEFILE_NAME, path.extname(PLACEFILE_NAME));

async function getWslWindowsDir(envName: string) {
	const windowsPath = (await cmd(`powershell.exe -NoProfile -Command '$env:${envName}'`)).trim();
	if (windowsPath === "") return undefined;
	return (await cmd(`wslpath -u '${windowsPath}'`)).trim();
}

// Studio has moved its AutoSaves folder between versions, so check both the current and legacy locations
async function getAutoSaveDirs(): Promise<Array<string>> {
	return runPlatform({
		darwin: async () => {
			const home = os.homedir();
			return [
				path.join(home, "Library", "Application Support", "Roblox", "RobloxStudio", "AutoSaves"),
				path.join(home, "Documents", "ROBLOX", "AutoSaves"),
			];
		},
		linux: async () => {
			const dirs = new Array<string>();
			const localAppData = await getWslWindowsDir("LOCALAPPDATA");
			if (localAppData) dirs.push(path.join(localAppData, "Roblox", "RobloxStudio", "AutoSaves"));
			const userProfile = await getWslWindowsDir("USERPROFILE");
			if (userProfile) dirs.push(path.join(userProfile, "Documents", "ROBLOX", "AutoSaves"));
			return dirs;
		},
		win32: async () => {
			const localAppData = process.env.LOCALAPPDATA ?? path.join(os.homedir(), "AppData", "Local");
			return [
				path.join(localAppData, "Roblox", "RobloxStudio", "AutoSaves"),
				path.join(os.homedir(), "Documents", "ROBLOX", "AutoSaves"),
			];
		},
	});
}

async function findRecoveryFiles(dirs: ReadonlyArray<string>, sessionStart: number) {
	const prefix = `${PLACE_NAME}_AutoRecovery_`.toLowerCase();
	const results = new Array<{ filePath: string; mtime: Date }>();
	for (const dir of dirs) {
		let names: Array<string>;
		try {
			names = await fs.readdir(dir);
		} catch {
			continue;
		}
		for (const name of names) {
			const lowerName = name.toLowerCase();
			if (!lowerName.startsWith(prefix) || !lowerName.endsWith(".rbxl")) continue;
			const filePath = path.join(dir, name);
			const stat = await fs.stat(filePath);
			if (stat.isFile() && stat.mtimeMs >= sessionStart - MTIME_SLACK_MS) {
				results.push({ filePath, mtime: stat.mtime });
			}
		}
	}
	return results;
}

// Studio can hold the file open for a moment after being killed, especially on Windows
async function withRetry<T>(callback: () => Promise<T>): Promise<T> {
	for (let i = 0; ; i++) {
		try {
			return await callback();
		} catch (e) {
			const code = (e as NodeJS.ErrnoException).code;
			if (i >= RETRY_COUNT || (code !== "EBUSY" && code !== "EPERM" && code !== "EACCES")) throw e;
			await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
		}
	}
}

async function moveFile(from: string, to: string) {
	try {
		await fs.rename(from, to);
	} catch (e) {
		// e.g. WSL project on the Linux filesystem, AutoSaves on /mnt/c
		if ((e as NodeJS.ErrnoException).code !== "EXDEV") throw e;
		await fs.copyFile(from, to);
		await fs.rm(from);
	}
}

async function ensureRecoveryDir(projectPath: string) {
	const rootDir = path.join(projectPath, RECOVERY_DIR_NAME);
	const recoveryDir = path.join(rootDir, "recovery");
	await fs.mkdir(recoveryDir, { recursive: true });
	const gitignorePath = path.join(rootDir, ".gitignore");
	try {
		await fs.writeFile(gitignorePath, "*\n", { flag: "wx" });
	} catch {}
	return recoveryDir;
}

async function pruneRecoveryDir(recoveryDir: string) {
	const names = (await fs.readdir(recoveryDir)).filter(name => name.endsWith(".rbxl")).sort();
	for (const name of names.slice(0, Math.max(0, names.length - RECOVERY_KEEP_COUNT))) {
		await fs.rm(path.join(recoveryDir, name), { force: true });
	}
}

/**
 * Moves or deletes the Studio auto-recovery files written by a session that `stop` force-killed,
 * so the next launch does not show the auto-recovery prompt.
 * Only files for this place modified since `sessionStart` are touched.
 */
export async function handleAutoRecovery(
	projectPath: string,
	mode: Exclude<AutoRecoveryMode, "keep">,
	sessionStart: number,
) {
	const files = await findRecoveryFiles(await getAutoSaveDirs(), sessionStart);
	if (files.length === 0) return;

	if (mode === "delete") {
		for (const { filePath } of files) {
			await withRetry(() => fs.rm(filePath, { force: true }));
			console.log(kleur.yellow("Deleted Studio auto-recovery file"), filePath);
		}
		return;
	}

	const recoveryDir = await ensureRecoveryDir(projectPath);
	for (const { filePath, mtime } of files) {
		const stamp = mtime
			.toISOString()
			.replace(/\.\d+Z$/, "")
			.replace(/:/g, "-");
		const destination = path.join(recoveryDir, `${stamp}_${path.basename(filePath)}`);
		await withRetry(() => moveFile(filePath, destination));
		console.log(kleur.yellow("Moved Studio auto-recovery file to"), path.relative(projectPath, destination));
	}
	await pruneRecoveryDir(recoveryDir);
}
