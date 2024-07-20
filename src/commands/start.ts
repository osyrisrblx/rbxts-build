import yargs from "yargs";
import { identity } from "../util/identity";
import { run } from "../util/run";
import { getSettings } from "../util/getSettings";

const command = "start";

async function handler() {
	const projectPath = process.cwd();
	const settings = await getSettings(projectPath);
	const prefix = settings.prefix ?? "";

	await run("npm", ["run", prefix + "compile", "--silent"]);
	await run("npm", ["run", prefix + "build", "--silent"]);
	await run("npm", ["run", prefix + "open", "--silent"]);
}

export = identity<yargs.CommandModule>({ command, handler });
