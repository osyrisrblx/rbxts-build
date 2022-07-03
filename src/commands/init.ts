import fs from "fs/promises";
import path from "path";
import yargs from "yargs";
import { CLIError } from "../errors/CLIError";
import { identity } from "../util/identity";

const command = "init";

const SCRIPT_NAMES = ["compile", "build", "open", "start", "stop", "sync", "watch"];

async function handler() {
	const projectPath = process.cwd();
	const pkgJsonPath = path.join(projectPath, "package.json");
	await fs.access(pkgJsonPath);

	const pkgJson = JSON.parse((await fs.readFile(pkgJsonPath)).toString());
	pkgJson.scripts ??= {};

	for (const scriptName of SCRIPT_NAMES) {
		if (pkgJson.scripts[scriptName] !== undefined) {
			throw new CLIError(`Updating package.json failed, script "${scriptName}" already exists!`);
		}
		pkgJson.scripts[scriptName] = `rbxts-build ${scriptName}`;
	}

	await fs.writeFile(pkgJsonPath, JSON.stringify(pkgJson, undefined, 2));
}

export = identity<yargs.CommandModule>({ command, handler });
