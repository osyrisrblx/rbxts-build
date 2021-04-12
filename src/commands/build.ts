import yargs from "yargs";
import { PLACEFILE_NAME } from "../constants";
import { getSettings } from "../util/getSettings";
import { identity } from "../util/identity";
import { run } from "../util/run";
import { platform } from "../util/runPlatform";

const command = "build";

async function handler() {
	const projectPath = process.cwd();
	const settings = await getSettings(projectPath);

	const rojo = platform === "linux" && settings.wslUseExe ? "rojo.exe" : "rojo";
	await run(rojo, ["build", ...(settings.rojoBuildArgs ?? ["--output", PLACEFILE_NAME])]);
}

export = identity<yargs.CommandModule>({ command, handler });
