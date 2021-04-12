import yargs from "yargs";
import { PLACEFILE_NAME, SYNC_SCRIPT_PATH } from "../constants";
import { getPackageJson } from "../util/getPackageJson";
import { getSettings } from "../util/getSettings";
import { getWindowsPath } from "../util/getWindowsPath";
import { identity } from "../util/identity";
import { run } from "../util/run";
import { platform } from "../util/runPlatform";

const command = "sync";

async function handler() {
	const projectPath = process.cwd();
	const pkgJson = getPackageJson(projectPath);
	const settings = getSettings(pkgJson);

	await run("npm", ["run", "build", "--silent"]);

	const outPath = settings.syncLocation ?? "src/services.d.ts";

	if (platform === "linux" && settings.wslUseExe) {
		const syncScriptPath = await getWindowsPath(SYNC_SCRIPT_PATH);
		await run("remodel.exe", ["run", syncScriptPath, PLACEFILE_NAME, outPath]);
	} else {
		await run("remodel", ["run", SYNC_SCRIPT_PATH, PLACEFILE_NAME, outPath]);
	}
}

export = identity<yargs.CommandModule>({ command, handler });
