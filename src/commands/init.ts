import chalk from "chalk";
import fs from "fs/promises";
import path from "path";
import yargs from "yargs";
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
			console.log(chalk.yellow("warning:"), `package.json script "${scriptName}" already exists, overwriting!`);
			console.log(`\toriginal: "${pkgJson.scripts[scriptName]}"`);
		}
		pkgJson.scripts[scriptName] = `rbxts-build ${scriptName}`;
	}

	await fs.writeFile(pkgJsonPath, JSON.stringify(pkgJson, undefined, 2));
}

export = identity<yargs.CommandModule>({ command, handler });
