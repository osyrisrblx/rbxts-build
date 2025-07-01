import path from "path";
import yargs from "yargs";
import { PLACEFILE_NAME, WSL_SYNC_POLL_INTERVAL, DEFAULT_STUDIO_WAIT_TIMEOUT } from "../constants";
import { getSettings } from "../util/getSettings";
import { identity } from "../util/identity";
import { run } from "../util/run";
import { processManager, setupSignalHandlers } from "../util/processManager";
import {
	shouldUseWindowsTemp,
	getWindowsSafePath,
	getLockFilePath,
	syncFromWindows,
	isWindowsFileNewer,
	checkWindowsFileExists,
	waitForWindowsFile,
	isWSL,
} from "../util/wslFileSync";

const command = "watch";

async function handler() {
	// Setup signal handlers for graceful shutdown during watch
	setupSignalHandlers();
	const projectPath = process.cwd();
	const settings = await getSettings(projectPath);

	const rojo = isWSL() && settings.wslUseExe ? "rojo.exe" : "rojo";
	const rbxtsc = settings.dev ? "rbxtsc-dev" : "rbxtsc";
	run(rojo, ["serve"]).catch(console.warn);
	run(rbxtsc, ["-w"].concat(settings.rbxtscArgs ?? [])).catch(console.warn);

	// For WSL users, start monitoring the Windows file for changes
	if (shouldUseWindowsTemp(settings)) {
		await startWindowsFileWatcher(projectPath, settings);
	}
}

/**
 * Start monitoring the Windows-accessible file for changes and sync back to WSL
 */
async function startWindowsFileWatcher(
	projectPath: string,
	settings: { windowsSavePath?: string; useWindowsTemp?: boolean; studioWaitTimeout?: number },
) {
	try {
		const wslFilePath = path.join(projectPath, PLACEFILE_NAME);
		const windowsFilePath = await getWindowsSafePath(
			wslFilePath,
			settings.windowsSavePath,
			settings.useWindowsTemp,
		);

		console.log(`Monitoring Windows file for Studio changes: ${windowsFilePath}`);

		// Track the lockfile path
		const windowsLockFile = await getLockFilePath(wslFilePath, settings.windowsSavePath, settings.useWindowsTemp);
		const timeout = settings.studioWaitTimeout ?? DEFAULT_STUDIO_WAIT_TIMEOUT;

		// Wait for Studio to create the lockfile (using configured timeout)
		console.log(`Waiting for Studio to open (checking for lockfile)...`);
		const lockFileExists = await waitForWindowsFile(windowsLockFile, timeout);

		if (!lockFileExists) {
			const timeoutSeconds = Math.ceil(timeout / 1000);
			console.warn(`Timeout: Studio lockfile not detected after ${timeoutSeconds} seconds.`);
			console.warn("Studio may not have opened properly. Running stop command to clean up...");

			// Try to stop any Studio processes that might be stuck
			try {
				await run("npm", ["run", "stop", "--silent"]);
			} catch (error) {
				console.warn("Could not run stop command:", error instanceof Error ? error.message : String(error));
			}

			console.warn("Please try opening Studio again.");
			return;
		}

		console.log("Studio lockfile detected! Starting sync monitoring...");

		// Poll for changes from Studio saves
		const pollInterval = setInterval(async () => {
			try {
				// Check if Studio is still open by checking lockfile existence
				const isStudioOpen = await checkWindowsFileExists(windowsLockFile);
				if (!isStudioOpen) {
					console.log("Studio closed, stopping sync...");
					processManager.unregisterInterval(pollInterval);
					clearInterval(pollInterval);
					return;
				}

				const isNewer = await isWindowsFileNewer(wslFilePath, windowsFilePath);
				if (isNewer) {
					console.log("Studio save detected, syncing back to WSL...");
					await syncFromWindows(wslFilePath, windowsFilePath);
					console.log("File synced successfully");
				}
			} catch (error) {
				// Only log unexpected errors
				if (error instanceof Error && !error.message.includes("does not exist")) {
					console.warn(`Sync error: ${error.message}`);
				}
			}
		}, WSL_SYNC_POLL_INTERVAL);

		// Register interval for cleanup
		processManager.registerInterval(pollInterval, "Studio file sync polling");
	} catch (error) {
		console.warn(`Failed to start file monitor: ${error instanceof Error ? error.message : String(error)}`);
	}
}

export = identity<yargs.CommandModule>({ command, handler });
