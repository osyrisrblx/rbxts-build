import yargs from "yargs";
import { getPackageJson } from "../util/getPackageJson";
import { getSettings } from "../util/getSettings";
import { identity } from "../util/identity";
import { run } from "../util/run";

const command = "compile";

async function handler() {
	const projectPath = process.cwd();
	const pkgJson = getPackageJson(projectPath);
	const settings = getSettings(pkgJson);

	await run(settings.dev ? "rbxtsc-dev" : "rbxtsc", settings.rbxtscArgs ?? ["--verbose"]);
}

export = identity<yargs.CommandModule>({ command, handler });
