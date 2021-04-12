import yargs from "yargs";
import { PLACEFILE_NAME } from "../constants";
import { getPackageJson } from "../util/getPackageJson";
import { getSettings } from "../util/getSettings";
import { identity } from "../util/identity";
import { run } from "../util/run";
import { platform } from "../util/runPlatform";

const command = "build";

async function handler() {
	const projectPath = process.cwd();
	const pkgJson = getPackageJson(projectPath);
	const settings = getSettings(pkgJson);

	const rojo = platform === "linux" && settings.wslUseExe ? "rojo.exe" : "rojo";
	await run(rojo, ["build", ...(settings.rojoBuildArgs ?? ["--output", PLACEFILE_NAME])]);
}

export = identity<yargs.CommandModule>({ command, handler });
