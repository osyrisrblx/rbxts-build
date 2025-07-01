import fs from "fs";
import path from "path";
import yargs from "yargs";
import { PLACEFILE_NAME } from "../constants";
import { getSettings } from "../util/getSettings";
import { getCommandName } from "../util/getCommandName";
import { getWindowsPath } from "../util/getWindowsPath";
import { identity } from "../util/identity";
import { run } from "../util/run";
import { runPlatform } from "../util/runPlatform";
import { shouldUseWindowsTemp, ensureWindowsAccessible } from "../util/wslFileSync";
import { openWindowsFile } from "../util/windowsFileOps";

const command = "open";

function assertFileExists(filePath: string) {
	if (!fs.existsSync(filePath)) {
		throw new Error(`File '${PLACEFILE_NAME}' does not exist. Run 'build' first to create the file.`);
	}
}

async function handler() {
	const projectPath = process.cwd();
	const settings = await getSettings(projectPath);

	await runPlatform({
		darwin: () => {
			assertFileExists(PLACEFILE_NAME);
			return run("open", [PLACEFILE_NAME]);
		},
		linux: async () => {
			const placeFilePath = path.join(projectPath, PLACEFILE_NAME);
			assertFileExists(placeFilePath);

			if (shouldUseWindowsTemp(settings)) {
				// Copy to Windows temp location first - this is currently
				// required for sync to work
				const windowsPath = await ensureWindowsAccessible(
					placeFilePath,
					settings.windowsSavePath,
					settings.useWindowsTemp,
				);
				console.log(`File copied to Windows-accessible location: ${windowsPath}`);
				await openWindowsFile(windowsPath);
				return;
			}

			const fsPath = await getWindowsPath(placeFilePath);
			await openWindowsFile(fsPath);
		},
		win32: () => {
			assertFileExists(PLACEFILE_NAME);
			return run("start", [PLACEFILE_NAME]);
		},
	});

	if (settings.watchOnOpen !== false) {
		await run("npm", ["run", getCommandName(settings, "watch"), "--silent"]);
	}
}

export = identity<yargs.CommandModule>({ command, handler });
