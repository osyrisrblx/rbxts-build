import yargs from "yargs";
import { identity } from "../util/identity";
import { run } from "../util/run";

const command = "start";

async function handler() {
	await run("npm", ["run", "build", "--silent"]);
	await run("npm", ["run", "open", "--silent"]);
}

export = identity<yargs.CommandModule>({ command, handler });
