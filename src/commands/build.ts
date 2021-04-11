import yargs from "yargs";
import { PLACEFILE_NAME } from "../constants";
import { getPackageJson } from "../util/getPackageJson";
import { getSettings } from "../util/getSettings";
import { identity } from "../util/identity";
import { run } from "../util/run";

const command = "build";

async function handler() {
	const projectPath = process.cwd();
	const pkgJson = getPackageJson(projectPath);
	const settings = getSettings(pkgJson);

	await run("rojo", ["build", ...(settings.rojoBuildArgs ?? ["--output", PLACEFILE_NAME])]);
}

export = identity<yargs.CommandModule>({ command, handler });
