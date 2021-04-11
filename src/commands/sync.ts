import path from "path";
import yargs from "yargs";
import { PLACEFILE_NAME, SYNC_SCRIPT_PATH } from "../constants";
import { getPackageJson } from "../util/getPackageJson";
import { getWindowsPath } from "../util/getWindowsPath";
import { identity } from "../util/identity";
import { run } from "../util/run";

const command = "sync";

async function handler() {
	const projectPath = process.cwd();
	const pkgJson = getPackageJson(projectPath);
	const settings = pkgJson?.["rbxts-build"] ?? {};

	const rojoBuildArgs = settings.rojoBuildArgs ?? ["--output", PLACEFILE_NAME];

	await run("rojo", ["build", ...rojoBuildArgs]);

	const outPath = "src/services.d.ts";
	await run("remodel", ["run", SYNC_SCRIPT_PATH, PLACEFILE_NAME, outPath]);
}

export = identity<yargs.CommandModule>({ command, handler });
