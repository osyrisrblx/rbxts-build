import yargs from "yargs";
import { getPackageJson } from "../util/getPackageJson";
import { identity } from "../util/identity";
import { run } from "../util/run";

const command = "build";

async function handler() {
	const projectPath = process.cwd();
	const pkgJson = getPackageJson(projectPath);
	const settings = pkgJson?.["rbxts-build"] ?? {};

	await run(settings.dev ? "rbxtsc-dev" : "rbxtsc", settings.rbxtscArgs ?? ["--verbose"]);
}

export = identity<yargs.CommandModule>({ command, handler });
