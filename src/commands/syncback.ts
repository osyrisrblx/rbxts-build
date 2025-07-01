import path from "path";
import yargs from "yargs";
import { DEFAULT_STUDIO_WAIT_TIMEOUT, PLACEFILE_NAME, SYNCBACK_SCRIPT_PATH } from "../constants";
import { CLIError } from "../errors/CLIError";
import { getSettings } from "../util/getSettings";
import { identity } from "../util/identity";
import { run } from "../util/run";
import { checkRojoSyncback } from "../util/checkRojoSyncback";
import { getWindowsPath } from "../util/getWindowsPath";
import { waitForStudio } from "../util/waitForStudio";
import { shouldUseWindowsTemp, getLockFilePath, isWSL } from "../util/wslFileSync";
import { cmd } from "../util/cmd";
import { setupSignalHandlers } from "../util/processManager";
import fs from "fs";

const command = "syncback";

async function validateDependencies(settings: { wslUseExe?: boolean }): Promise<void> {
	const isUsingWSL = isWSL() && settings.wslUseExe;
	const luneCommand = isUsingWSL ? "lune.exe" : "lune";

	// Check if Lune is available and has correct version
	try {
		const result = await cmd(`${luneCommand} --version`);
		const versionMatch = result.match(/lune (\d+)\.(\d+)\.(\d+)/);

		if (!versionMatch) {
			throw new CLIError(`Unable to parse Lune version from: ${result.trim()}\n` + `Expected format: lune x.y.z`);
		}

		const [, major, minor] = versionMatch.map(Number);
		const version = `${major}.${minor}`;

		if (major < 0 || (major === 0 && minor < 9)) {
			throw new CLIError(
				`Lune version ${version} is not supported. Syncback requires Lune v0.9.0 or later.\n\n` +
					`Current version: v${version}\n` +
					`Required version: v0.9.0+\n\n` +
					`Update Lune:\n` +
					`• Visit: https://github.com/lune-org/lune/releases\n` +
					`• Or install via: cargo install lune`,
			);
		}
	} catch (error) {
		if (error instanceof CLIError) {
			throw error;
		}

		let message = `Missing required dependency: lune\n\n`;
		message += `Syncback requires the following tools:\n`;
		message += `• Rojo (for syncback functionality)\n`;
		message += `• Lune (for continuous monitoring)\n\n`;
		message += `To install lune:\n`;
		message += `• Visit: https://github.com/lune-org/lune/releases\n`;
		message += `• Required version: v0.9.0 or later`;

		if (isWSL()) {
			message += `\n\nFor WSL users: You may need to install the .exe versions or configure wslUseExe in settings.`;
		}

		throw new CLIError(message);
	}
}

async function validateProjectFiles(projectPath: string): Promise<void> {
	const placeFilePath = path.join(projectPath, PLACEFILE_NAME);
	const projectFilePath = path.join(projectPath, "default.project.json");

	if (!fs.existsSync(projectFilePath)) {
		throw new CLIError(
			`Project file not found: ${projectFilePath}\n` +
				`Syncback requires a Rojo project file to determine sync targets.`,
		);
	}

	if (!fs.existsSync(placeFilePath)) {
		console.warn(
			`Warning: Place file not found: ${placeFilePath}\n` + `Syncback will monitor for this file to be created.`,
		);
	}
}

async function handler(argv: yargs.ArgumentsCamelCase<SyncbackCommandArgs>): Promise<void> {
	const projectPath = process.cwd();
	const settings = await getSettings(projectPath);

	// Validate all dependencies and project files
	await Promise.all([checkRojoSyncback(), validateDependencies(settings), validateProjectFiles(projectPath)]);

	// Wait for Studio to open only if requested
	if (argv.waitForStudio) {
		if (shouldUseWindowsTemp(settings)) {
			// Get the correct lock file path based on where the file was opened
			const placeFilePath = path.join(projectPath, PLACEFILE_NAME);
			const lockFilePath = await getLockFilePath(
				placeFilePath,
				settings.windowsSavePath,
				settings.useWindowsTemp,
			);
			await waitForStudio(DEFAULT_STUDIO_WAIT_TIMEOUT, lockFilePath);
		} else {
			// Use default behavior when Windows temp is disabled
			await waitForStudio();
		}
	}

	// Determine sync mode based on watch flag
	const syncMode = argv.watch ? "watch" : "single";

	if (syncMode === "watch") {
		// Setup signal handlers for graceful shutdown during continuous monitoring
		setupSignalHandlers();
		console.log("Starting syncback monitoring...");
	} else {
		console.log("Performing single syncback...");
	}

	// Delegate to Lune script with appropriate mode
	if (isWSL() && settings.wslUseExe) {
		const syncScriptPath = await getWindowsPath(SYNCBACK_SCRIPT_PATH);
		await run("lune.exe", ["run", syncScriptPath, syncMode, PLACEFILE_NAME, "default.project.json"]);
	} else {
		await run("lune", ["run", SYNCBACK_SCRIPT_PATH, syncMode, PLACEFILE_NAME, "default.project.json"]);
	}
}

interface SyncbackCommandArgs {
	waitForStudio: boolean;
	watch: boolean;
}

export = identity<yargs.CommandModule<object, SyncbackCommandArgs>>({
	command,
	handler,
	builder: (yargs): yargs.Argv<SyncbackCommandArgs> => {
		return yargs
			.option("waitForStudio", {
				alias: "w",
				type: "boolean",
				description: "Wait for Roblox Studio to open before starting syncback",
				default: false,
			})
			.option("watch", {
				type: "boolean",
				description: "Run in continuous monitoring mode (watch for changes)",
				default: false,
			});
	},
});
