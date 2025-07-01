import fs from "fs";
import path from "path";
import { cmd } from "./cmd";
import { getWindowsPath } from "./getWindowsPath";
import { platform } from "./runPlatform";
import { validateWindowsPath, escapePowerShellPath } from "./pathSecurity";
import {
	DEFAULT_STUDIO_WAIT_TIMEOUT,
	WSL_PROGRESS_UPDATE_INTERVAL,
	WSL_RBXTS_BUILD_SUBDIR,
	WSL_SYNC_POLL_INTERVAL,
} from "../constants";
import {
	testWindowsPath,
	createWindowsDirectory,
	copyFileWindows,
	getWindowsFileModifiedTime,
	getWindowsTempPath,
} from "./windowsFileOps";

// Constants for file monitoring and sync operations

/**
 * Check if we're running on WSL
 */
export function isWSL(): boolean {
	return platform === "linux" && process.env.WSL_DISTRO_NAME !== undefined;
}

/**
 * Check if WSL Windows temp workaround should be used
 */
export function shouldUseWindowsTemp(settings: { useWindowsTemp?: boolean }): boolean {
	// Default to false, only enable if explicitly set to true
	return isWSL() && settings.useWindowsTemp === true;
}

/**
 * Get a Windows-accessible path for the given file
 * For WSL: Returns path in Windows temp directory
 * For other platforms: Returns original path
 */
export async function getWindowsSafePath(
	filePath: string,
	customWindowsPath?: string,
	useWindowsTemp?: boolean,
): Promise<string> {
	if (!isWSL() || useWindowsTemp === false) {
		return filePath;
	}

	const fileName = path.basename(filePath);

	if (customWindowsPath) {
		try {
			// Validate custom Windows path before using
			validateWindowsPath(customWindowsPath);
			// Use custom Windows path if provided
			const escapedPath = escapePowerShellPath(customWindowsPath);
			const windowsCustomPath = await cmd(`wslpath -w "${escapedPath}"`);
			return `${windowsCustomPath.trim()}\\${fileName}`;
		} catch (error) {
			throw new Error(
				`Invalid Windows path configuration: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	// Use Windows temp directory - use PowerShell to get the temp path
	const tempPath = await getWindowsTempPath();

	// Create a subdirectory for rbxts-build files - use Windows path separators
	const rbxtsBuildDir = `${tempPath}${WSL_RBXTS_BUILD_SUBDIR}`;

	return `${rbxtsBuildDir}\\${fileName}`;
}

/**
 * Ensure the given file is accessible from Windows
 * For WSL: Copies file to Windows-accessible location
 * For other platforms: Does nothing
 */
export async function ensureWindowsAccessible(
	filePath: string,
	customWindowsPath?: string,
	useWindowsTemp?: boolean,
): Promise<string> {
	if (!isWSL() || useWindowsTemp === false) {
		return filePath;
	}

	const windowsPath = await getWindowsSafePath(filePath, customWindowsPath, useWindowsTemp);
	const windowsDir = path.dirname(windowsPath);

	// Create Windows directory if it doesn't exist using PowerShell
	try {
		await createWindowsDirectory(windowsDir);
	} catch (error) {
		const originalError = error instanceof Error ? error.message : String(error);
		throw new Error(
			`Failed to create Windows directory '${windowsDir}'. ` +
				`This is required for Studio sync to work properly. ` +
				`Error: ${originalError}`,
		);
	}

	// Copy file to Windows location using PowerShell
	try {
		const wslSourcePath = await getWindowsPath(filePath);
		await copyFileWindows(wslSourcePath, windowsPath);
	} catch (error) {
		const originalError = error instanceof Error ? error.message : String(error);
		throw new Error(
			`Failed to copy file to Windows location. ` +
				`Without this, Studio changes cannot be saved back to your project. ` +
				`Error: ${originalError}`,
		);
	}

	return windowsPath;
}

/**
 * Sync file back from Windows location to WSL
 * For WSL: Copies file from Windows location back to WSL
 * For other platforms: Does nothing
 */
export async function syncFromWindows(wslPath: string, windowsPath: string): Promise<void> {
	if (!isWSL()) {
		return;
	}

	// Check if Windows file exists using PowerShell
	const windowsFileExists = await testWindowsPath(windowsPath).catch(() => false);

	if (!windowsFileExists) {
		throw new Error("Windows file does not exist or is not accessible");
	}

	// Copy from Windows back to WSL using PowerShell
	try {
		const wslTargetPath = await getWindowsPath(wslPath);
		await copyFileWindows(windowsPath, wslTargetPath);
	} catch (error) {
		throw new Error("Failed to sync file from Windows to WSL");
	}
}

/**
 * Check if Windows file is newer than WSL file
 */
export async function isWindowsFileNewer(wslPath: string, windowsPath: string): Promise<boolean> {
	if (!isWSL()) {
		return false;
	}

	try {
		// Get WSL file stats
		const wslStats = fs.existsSync(wslPath) ? fs.statSync(wslPath) : null;

		// Get Windows file stats using PowerShell
		const windowsDateStr = await getWindowsFileModifiedTime(windowsPath).catch(() => null);

		if (!wslStats || !windowsDateStr) {
			return windowsDateStr !== null; // If only Windows file exists, it's "newer"
		}

		// Parse Windows date/time using PowerShell formatted output
		const windowsModified = new Date(windowsDateStr.trim());

		return windowsModified > wslStats.mtime;
	} catch {
		return false;
	}
}

/**
 * Check if a file exists in Windows using PowerShell
 */
export async function checkWindowsFileExists(windowsPath: string): Promise<boolean> {
	try {
		return await testWindowsPath(windowsPath);
	} catch {
		return false;
	}
}

/**
 * Wait for a Windows file to exist, with timeout
 */
export async function waitForWindowsFile(
	windowsPath: string,
	timeoutMs: number = DEFAULT_STUDIO_WAIT_TIMEOUT,
): Promise<boolean> {
	const startTime = Date.now();
	let lastProgressTime = 0;

	while (Date.now() - startTime < timeoutMs) {
		const exists = await checkWindowsFileExists(windowsPath);
		if (exists) {
			return true;
		}

		// Show progress every 10 seconds
		const elapsed = Date.now() - startTime;
		if (elapsed - lastProgressTime >= WSL_PROGRESS_UPDATE_INTERVAL) {
			const remaining = Math.ceil((timeoutMs - elapsed) / 1000);
			console.log(`Still waiting for Studio to open... (${remaining}s remaining)`);
			lastProgressTime = elapsed;
		}

		await new Promise(resolve => setTimeout(resolve, WSL_SYNC_POLL_INTERVAL));
	}

	return false; // Timeout reached
}

/**
 * Get the lockfile path for a given place file
 */
export async function getLockFilePath(
	placeFilePath: string,
	customWindowsPath?: string,
	useWindowsTemp?: boolean,
): Promise<string> {
	if (!isWSL() || useWindowsTemp === false) {
		return placeFilePath + ".lock";
	}

	const windowsPath = await getWindowsSafePath(placeFilePath, customWindowsPath, useWindowsTemp);
	return windowsPath + ".lock";
}
