import yargs from "yargs";
import { identity } from "../util/identity";
import { run } from "../util/run";
import { getSettings } from "../util/getSettings";
import { getCommandName } from "../util/getCommandName";

const command = "start";

async function handler() {
	const projectPath = process.cwd();
	const settings = await getSettings(projectPath);

	await run("npm", ["run", getCommandName(settings, "compile"), "--silent"]);
	await run("npm", ["run", getCommandName(settings, "build"), "--silent"]);

	// Start syncback in parallel if enabled
	if (settings.syncback) {
		run("rbxts-build", ["syncback", "--watch", "--wait-for-studio"]).catch(console.warn);
	}

	await run("npm", ["run", getCommandName(settings, "open"), "--silent"]);
}

export = identity<yargs.CommandModule>({ command, handler });
