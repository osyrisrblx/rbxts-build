import yargs from "yargs";
import { getSettings } from "../util/getSettings";
import { identity } from "../util/identity";
import { run } from "../util/run";

const command = "compile";

async function handler() {
	const projectPath = process.cwd();
	const settings = await getSettings(projectPath);

	const rbxtsc = settings.dev ? "rbxtsc-dev" : "rbxtsc";
	await run(rbxtsc, settings.rbxtscArgs ?? ["--verbose"]);
}

export = identity<yargs.CommandModule>({ command, handler });
