import yargs from "yargs";
import { identity } from "../util/identity";
import { run } from "../util/run";
import { getCommandName, getSettings } from "../util/getSettings";

const command = "start";

async function handler() {
	const projectPath = process.cwd();
	const settings = await getSettings(projectPath);

	await run("npm", ["run", getCommandName(settings, "compile"), "--silent"]);
	await run("npm", ["run", getCommandName(settings, "build"), "--silent"]);
	await run("npm", ["run", getCommandName(settings, "open"), "--silent"]);
}

export = identity<yargs.CommandModule>({ command, handler });
