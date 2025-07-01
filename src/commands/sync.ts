import yargs from "yargs";
import { PLACEFILE_NAME, SYNC_SCRIPT_PATH } from "../constants";
import { getSettings } from "../util/getSettings";
import { getCommandName } from "../util/getCommandName";
import { getWindowsPath } from "../util/getWindowsPath";
import { identity } from "../util/identity";
import { run } from "../util/run";
import { platform } from "../util/runPlatform";
import { isWSL } from "../util/wslFileSync";

const command = "sync";

async function handler() {
	const projectPath = process.cwd();
	const settings = await getSettings(projectPath);

	await run("npm", ["run", getCommandName(settings, "build"), "--silent"]);

	const outPath = settings.syncLocation ?? "src/services.d.ts";

	if (isWSL() && settings.wslUseExe) {
		const syncScriptPath = await getWindowsPath(SYNC_SCRIPT_PATH);
		await run("lune.exe", ["run", syncScriptPath, PLACEFILE_NAME, outPath]);
	} else {
		await run("lune", ["run", SYNC_SCRIPT_PATH, PLACEFILE_NAME, outPath]);
	}
}

export = identity<yargs.CommandModule>({ command, handler });
