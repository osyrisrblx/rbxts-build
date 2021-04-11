import fs from "fs/promises";
import path from "path";
import yargs from "yargs";
import { CLIError } from "../errors/CLIError";
import { identity } from "../util/identity";

const command = "init";

const SCRIPT_NAMES = ["compile", "build", "open", "start", "stop", "sync"];

async function handler(args: yargs.Arguments) {
	const name = path.basename(args.$0);
	const projectPath = process.cwd();
	const pkgJsonPath = path.join(projectPath, "package.json");
	await fs.access(pkgJsonPath);
	const pkgJson = JSON.parse((await fs.readFile(pkgJsonPath)).toString());
	if (pkgJson.scripts === undefined) {
		pkgJson.scripts = {};
	}
	for (const scriptName of SCRIPT_NAMES) {
		if (pkgJson.scripts[scriptName] !== undefined) {
			throw new CLIError(`Updating package.json failed, script "${scriptName}" already exists!`);
		}
	}
	for (const scriptName of SCRIPT_NAMES) {
		pkgJson.scripts[scriptName] = `${name} ${scriptName}`;
	}
	await fs.writeFile(pkgJsonPath, JSON.stringify(pkgJson, undefined, 2));
}

export = identity<yargs.CommandModule>({ command, handler });
