import { CLIError } from "../errors/CLIError";
import { DEFAULT_STUDIO_WAIT_TIMEOUT, LOCKFILE_NAME } from "../constants";
import fs from "fs";
import { checkWindowsFileExists, isWSL } from "./wslFileSync";

async function checkLockFileExists(lockFilePath: string, isCustomWindowsPath: boolean): Promise<boolean> {
	try {
		if (isCustomWindowsPath && isWSL()) {
			return await checkWindowsFileExists(lockFilePath);
		} else {
			// Use normal fs.existsSync for local files
			return fs.existsSync(lockFilePath);
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new CLIError(`Failed to check for Studio lock file: ${lockFilePath}\nError: ${errorMessage}`);
	}
}

export async function waitForStudio(
	timeoutMs: number = DEFAULT_STUDIO_WAIT_TIMEOUT,
	customLockFilePath?: string,
): Promise<void> {
	console.log("Waiting for Studio to open...");
	const startTime = Date.now();
	const lockFilePath = customLockFilePath || LOCKFILE_NAME;
	const isCustomWindowsPath = Boolean(customLockFilePath);

	while (true) {
		const lockFileExists = await checkLockFileExists(lockFilePath, isCustomWindowsPath);

		if (lockFileExists) {
			console.log("Studio detected!");
			return;
		}

		if (Date.now() - startTime > timeoutMs) {
			const timeoutSeconds = Math.round(timeoutMs / 1000);
			throw new CLIError(
				`Studio did not open within ${timeoutSeconds} seconds. ` +
					`Expected lock file: ${lockFilePath}\n` +
					`Troubleshooting:\n` +
					`• If Studio is updating, wait and try again\n` +
					`• If Studio won't start, check Task Manager for hung processes\n` +
					`• Verify the place file can be opened in Studio`,
			);
		}

		await new Promise(resolve => setTimeout(resolve, 1000)); // Check every 1 second
	}
}
