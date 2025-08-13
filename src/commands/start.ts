import yargs from "yargs";
import { identity } from "../util/identity";
import { run } from "../util/run";
import { getSettings } from "../util/getSettings";
import { getCommandName } from "../util/getCommandName";

const command = "start";

async function handler() {
	const projectPath = process.cwd();
	const settings = await getSettings(projectPath);
	const packageManager = settings.packageManager ?? "npm";
	
	await run(packageManager, ["run", getCommandName(settings, "compile"), "--silent"]);
	await run(packageManager, ["run", getCommandName(settings, "build"), "--silent"]);
	await run(packageManager, ["run", getCommandName(settings, "open"), "--silent"]);
}

export = identity<yargs.CommandModule>({ command, handler });
