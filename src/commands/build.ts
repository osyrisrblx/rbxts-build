import yargs from "yargs";
import { PLACEFILE_NAME } from "../constants";
import { getPackageJson } from "../util/getPackageJson";
import { identity } from "../util/identity";
import { run } from "../util/run";

const command = "build";

async function handler() {
	const projectPath = process.cwd();
	const pkgJson = getPackageJson(projectPath);
	const settings = pkgJson?.["rbxts-build"] ?? {};

	const rbxtscArgs = settings.rbxtscArgs ?? ["--verbose"];
	const rojoBuildArgs = settings.rojoBuildArgs ?? ["--output", PLACEFILE_NAME];

	await run(settings.dev ? "rbxtsc-dev" : "rbxtsc", rbxtscArgs);
	await run("rojo", ["build", ...rojoBuildArgs]);
}

export = identity<yargs.CommandModule>({ command, handler });
