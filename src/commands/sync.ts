import yargs from "yargs";
import { PLACEFILE_NAME, SYNC_SCRIPT_PATH } from "../constants";
import { getPackageJson } from "../util/getPackageJson";
import { getSettings } from "../util/getSettings";
import { identity } from "../util/identity";
import { run } from "../util/run";

const command = "sync";

async function handler() {
	const projectPath = process.cwd();
	const pkgJson = getPackageJson(projectPath);
	const settings = getSettings(pkgJson);

	const rojoBuildArgs = settings.rojoBuildArgs ?? ["--output", PLACEFILE_NAME];

	await run("rojo", ["build", ...rojoBuildArgs]);

	const outPath = settings.syncLocation ?? "src/services.d.ts";
	await run("remodel", ["run", SYNC_SCRIPT_PATH, PLACEFILE_NAME, outPath]);
}

export = identity<yargs.CommandModule>({ command, handler });
