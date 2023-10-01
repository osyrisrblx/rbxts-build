import yargs from "yargs";
import { PLACEFILE_NAME, SYNC_SCRIPT_PATH } from "../constants";
import { getSettings } from "../util/getSettings";
import { getWindowsPath } from "../util/getWindowsPath";
import { identity } from "../util/identity";
import { run } from "../util/run";
import { platform } from "../util/runPlatform";

const command = "sync";

async function handler() {
	const projectPath = process.cwd();
	const settings = await getSettings(projectPath);

	await run("npm", ["run", "build", "--silent"]);

	const outPath = settings.syncLocation ?? "src/services.d.ts";

	if (platform === "linux" && settings.wslUseExe) {
		const syncScriptPath = await getWindowsPath(SYNC_SCRIPT_PATH);
		await run("lune.exe", [syncScriptPath, PLACEFILE_NAME, outPath]);
	} else {
		await run("lune", [SYNC_SCRIPT_PATH, PLACEFILE_NAME, outPath]);
	}
}

export = identity<yargs.CommandModule>({ command, handler });
