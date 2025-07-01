import fs from "fs/promises";
import path from "path";
import { LOCKFILE_NAME } from "../constants";
import { readWindowsFileFirstLine, removeWindowsFile } from "./windowsFileOps";
import { run } from "./run";
import { runPlatform } from "./runPlatform";

/**
 * Reads process ID from a Windows lockfile using PowerShell
 * @param windowsLockFilePath - Windows path to the lockfile
 * @returns Process ID if found, null otherwise
 */
export async function readProcessIdFromWindowsLockfile(windowsLockFilePath: string): Promise<string | null> {
	try {
		const processId = await readWindowsFileFirstLine(windowsLockFilePath);
		return processId || null;
	} catch (error) {
		console.warn(
			`Could not read Windows lockfile ${windowsLockFilePath}: ${
				error instanceof Error ? error.message : String(error)
			}`,
		);
		return null;
	}
}

/**
 * Reads process ID from a local WSL lockfile
 * @param lockFilePath - Path to the lockfile
 * @returns Process ID if found, null otherwise
 */
export async function readProcessIdFromLockfile(lockFilePath: string): Promise<string | null> {
	try {
		const lockFileHandle = await fs.open(lockFilePath, "r");
		try {
			const buffer = Buffer.alloc(50); // Enough for a process ID
			const { bytesRead } = await lockFileHandle.read(buffer, 0, 50, 0);
			const content = buffer.subarray(0, bytesRead).toString();
			const processId = content.split("\n")[0].trim();
			return processId || null;
		} finally {
			await lockFileHandle.close();
		}
	} catch (error) {
		if (error instanceof Error && "code" in error && error.code !== "ENOENT") {
			console.warn(`Unexpected error reading lockfile ${lockFilePath}: ${error.message}`);
		}
		return null;
	}
}

/**
 * Terminates Studio processes using platform-specific commands
 * @param processId - The process ID to terminate
 */
export async function terminateStudioProcess(processId: string): Promise<void> {
	await runPlatform({
		darwin: () => run("kill", ["-9", processId]),
		linux: () => run("taskkill.exe", ["/f", "/pid", processId]),
		win32: () => run("taskkill", ["/f", "/pid", processId]),
	});
}

/**
 * Safely removes a Windows lockfile using PowerShell
 * @param windowsLockFilePath - Windows path to the lockfile
 */
export async function cleanupWindowsLockfile(windowsLockFilePath: string): Promise<void> {
	try {
		await removeWindowsFile(windowsLockFilePath);
	} catch (error) {
		// Ignore cleanup errors - lockfile might already be gone
	}
}

/**
 * Safely removes the WSL lockfile with proper error handling
 * @param projectPath - The project directory path
 */
export async function cleanupLockfile(projectPath: string): Promise<void> {
	const lockFilePath = path.join(projectPath, LOCKFILE_NAME);

	try {
		await fs.rm(lockFilePath, { force: true });
	} catch (error) {
		if (error instanceof Error && "code" in error && error.code !== "ENOENT") {
			console.warn(`Failed to clean up lockfile: ${error.message}`);
		}
	}
}
