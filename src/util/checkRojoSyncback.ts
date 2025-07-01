import { execFile } from "child_process";
import { promisify } from "util";
import { CLIError } from "../errors/CLIError";
import { getSettings } from "./getSettings";
import { isWSL } from "./wslFileSync";

const execFileAsync = promisify(execFile);

// Cache for Rojo validation results to avoid redundant process spawns
const rojoValidationCache = new Map<string, boolean>();

async function checkRojoCommand(rojoCommand: string): Promise<void> {
	if (rojoValidationCache.has(rojoCommand)) {
		if (!rojoValidationCache.get(rojoCommand)) {
			throw new Error("Rojo syncback not supported (cached result)");
		}
		return;
	}

	try {
		await execFileAsync(rojoCommand, ["syncback", "--help"], {
			timeout: 5000,
		});

		rojoValidationCache.set(rojoCommand, true);
	} catch (error) {
		rojoValidationCache.set(rojoCommand, false);

		if (error instanceof Error && "code" in error) {
			if (error.code === "ENOENT") {
				throw new Error(`Command '${rojoCommand}' not found`);
			} else if (error.code === "TIMEOUT") {
				throw new Error(`Command '${rojoCommand} syncback --help' timed out`);
			} else if (typeof error.code === "number") {
				throw new Error(`Command '${rojoCommand} syncback --help' exited with code ${error.code}`);
			}
		}

		throw new Error(
			`Failed to execute '${rojoCommand}': ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

export async function checkRojoSyncback(): Promise<void> {
	const settings = await getSettings(process.cwd());
	const rojo = isWSL() && settings.wslUseExe ? "rojo.exe" : "rojo";

	try {
		await checkRojoCommand(rojo);
	} catch (error) {
		let message = `Rojo syncback functionality is not available.\n\n`;
		message += `Syncback requires the UpliftGames fork of Rojo with syncback support.\n\n`;
		message += `Installation options:\n`;
		message += `• Download from: https://github.com/UpliftGames/rojo/\n`;
		message += `Note: Standard Rojo does not include syncback functionality.`;

		if (error) {
			const errorDetails = error instanceof Error ? error.message : String(error);
			message += `\n\nError details: ${errorDetails}`;
		}

		throw new CLIError(message);
	}
}
