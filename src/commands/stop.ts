import path from "path";
import yargs from "yargs";
import { LOCKFILE_NAME, PLACEFILE_NAME } from "../constants";
import { RbxtsBuildSettings } from "../typeChecks";
import { getSettings } from "../util/getSettings";
import { identity } from "../util/identity";
import {
	readProcessIdFromWindowsLockfile,
	readProcessIdFromLockfile,
	terminateStudioProcess,
	cleanupWindowsLockfile,
	cleanupLockfile,
} from "../util/studioProcess";
import { shouldUseWindowsTemp, getLockFilePath, checkWindowsFileExists } from "../util/wslFileSync";
import { cleanupAllCaches } from "../util/operationCache";

const command = "stop";

/**
 * Attempts to stop Studio using Windows temp lockfile
 * @param projectPath - The project directory path
 * @param settings - Project settings
 * @returns true if Studio was stopped, false if no lockfile found
 */
async function tryStopWindowsTempStudio(projectPath: string, settings: RbxtsBuildSettings): Promise<boolean> {
	if (!shouldUseWindowsTemp(settings)) {
		return false;
	}

	try {
		const placeFilePath = path.join(projectPath, PLACEFILE_NAME);
		const windowsLockFile = await getLockFilePath(placeFilePath, settings.windowsSavePath, settings.useWindowsTemp);

		const windowsLockExists = await checkWindowsFileExists(windowsLockFile);
		if (windowsLockExists) {
			console.log("Found Studio lockfile in Windows temp, attempting to stop Studio...");

			// Read process ID from Windows lockfile using PowerShell
			const processId = await readProcessIdFromWindowsLockfile(windowsLockFile);
			if (processId) {
				console.log(`Found lockfile with process ID ${processId}, stopping Studio...`);
				try {
					await terminateStudioProcess(processId);
					console.log("Studio process terminated.");
					// Clean up Windows lockfile after successful termination
					await cleanupWindowsLockfile(windowsLockFile);
					return true;
				} catch (error) {
					// Process might already be terminated, clean up stale lockfile
					const errorMessage = error instanceof Error ? error.message : String(error);
					if (errorMessage.includes("not found") || errorMessage.includes("128")) {
						console.log("Process already terminated, cleaning up stale lockfile...");
						await cleanupWindowsLockfile(windowsLockFile);
						return true;
					}
					throw error; // Re-throw unexpected errors
				}
			} else {
				console.warn("Windows lockfile exists but contains no valid process ID");
				// Clean up invalid lockfile
				await cleanupWindowsLockfile(windowsLockFile);
			}
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.warn(`Could not check Windows temp lockfile: ${errorMessage}`);
	}

	return false;
}

/**
 * Attempts to stop Studio using local lockfile
 * @param projectPath - The project directory path
 * @returns true if Studio was stopped, false if no lockfile found
 */
async function tryStopLocalStudio(projectPath: string): Promise<boolean> {
	const lockFilePath = path.join(projectPath, LOCKFILE_NAME);

	const processId = await readProcessIdFromLockfile(lockFilePath);
	if (processId) {
		console.log(`Found lockfile with process ID ${processId}, stopping Studio...`);
		await terminateStudioProcess(processId);
		console.log("Studio process terminated.");
		return true;
	}

	return false;
}

/**
 * Main handler for the stop command
 */
async function handler(): Promise<void> {
	try {
		const projectPath = process.cwd();
		const settings = await getSettings(projectPath);

		// Try Windows temp lockfile first if enabled
		const stoppedFromWindows = await tryStopWindowsTempStudio(projectPath, settings);
		if (stoppedFromWindows) {
			return;
		}

		// Remove local lockfile if it exists
		const stoppedFromLocal = await tryStopLocalStudio(projectPath);
		if (!stoppedFromLocal) {
			console.log("No Studio lockfile found or Studio not running.");
		}

		// Clean up lockfile regardless of success
		await cleanupLockfile(projectPath);
	} finally {
		// Clean up operation caches to allow process to exit naturally
		cleanupAllCaches();
	}
}

export = identity<yargs.CommandModule>({ command, handler });
