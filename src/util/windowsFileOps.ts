import { cmd } from "./cmd";
import { escapePowerShellPath } from "./pathSecurity";
import { tempPathCache, fileMetadataCache } from "./operationCache";

/**
 * Test if a Windows path exists (cached)
 */
export async function testWindowsPath(windowsPath: string): Promise<boolean> {
	const cacheKey = `test-path:${windowsPath}`;
	return await fileMetadataCache.getOrCompute(
		cacheKey,
		async () => {
			const escapedPath = escapePowerShellPath(windowsPath);
			const result = await cmd(`powershell.exe -Command "Test-Path -LiteralPath '${escapedPath}'"`);
			return result.trim().toLowerCase() === "true";
		},
		5000, // Cache for 5 seconds (file existence can change quickly)
	);
}

/**
 * Create a Windows directory
 */
export async function createWindowsDirectory(windowsPath: string): Promise<void> {
	const escapedPath = escapePowerShellPath(windowsPath);
	await cmd(
		`powershell.exe -Command "if (!(Test-Path -LiteralPath '${escapedPath}')) { New-Item -ItemType Directory -LiteralPath '${escapedPath}' -Force }"`,
	);
}

/**
 * Copy a file
 */
export async function copyFileWindows(sourcePath: string, destinationPath: string): Promise<void> {
	const escapedSource = escapePowerShellPath(sourcePath);
	const escapedDestination = escapePowerShellPath(destinationPath);
	await cmd(
		`powershell.exe -Command "Copy-Item -LiteralPath '${escapedSource}' -Destination '${escapedDestination}' -Force"`,
	);
}

/**
 * Get file modified time (cached)
 */
export async function getWindowsFileModifiedTime(windowsPath: string): Promise<string> {
	const cacheKey = `modified-time:${windowsPath}`;
	return await fileMetadataCache.getOrCompute(
		cacheKey,
		async () => {
			const escapedPath = escapePowerShellPath(windowsPath);
			return await cmd(
				`powershell.exe -Command "(Get-Item -LiteralPath '${escapedPath}').LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss')"`,
			);
		},
		2000, // Cache for 2 seconds (modification time changes frequently)
	);
}

/**
 * Get Windows temp path (cached)
 */
export async function getWindowsTempPath(): Promise<string> {
	const cacheKey = "windows-temp-path";
	return await tempPathCache.getOrCompute(
		cacheKey,
		async () => {
			const result = await cmd('powershell.exe -Command "[System.IO.Path]::GetTempPath()"');
			return result.trim();
		},
		300000, // Cache for 5 minutes (temp path rarely changes)
	);
}

/**
 * Read file content (first line only)
 */
export async function readWindowsFileFirstLine(windowsPath: string): Promise<string> {
	const escapedPath = escapePowerShellPath(windowsPath);
	const result = await cmd(`powershell.exe -Command "Get-Content -LiteralPath '${escapedPath}' -TotalCount 1"`);
	return result.trim();
}

/**
 * Remove a Windows file
 */
export async function removeWindowsFile(windowsPath: string): Promise<void> {
	const escapedPath = escapePowerShellPath(windowsPath);
	await cmd(
		`powershell.exe -Command "Remove-Item -LiteralPath '${escapedPath}' -Force -ErrorAction SilentlyContinue"`,
	);
}

/**
 * Open a Windows file with the default application
 */
export async function openWindowsFile(windowsPath: string): Promise<void> {
	const escapedPath = escapePowerShellPath(windowsPath);
	await cmd(`powershell.exe -Command "Start-Process '${escapedPath}'"`);
}
