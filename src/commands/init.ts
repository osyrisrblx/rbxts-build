import kleur from "kleur";
import fs from "fs/promises";
import path from "path";
import yargs from "yargs";
import { identity } from "../util/identity";
import { SCRIPT_NAMES } from "../typeChecks";
import { getCommandName, getSettings } from "../util/getSettings";

const command = "init";

async function handler() {
	const projectPath = process.cwd();
	const pkgJsonPath = path.join(projectPath, "package.json");
	await fs.access(pkgJsonPath);

	const pkgJson = JSON.parse((await fs.readFile(pkgJsonPath)).toString());
	pkgJson.scripts ??= {};

	const settings = await getSettings(projectPath);

	for (const defaultName of SCRIPT_NAMES) {
		const scriptName = getCommandName(settings, defaultName);
		if (pkgJson.scripts[scriptName] !== undefined) {
			console.log(kleur.yellow("warning:"), `package.json script "${scriptName}" already exists, overwriting!`);
			console.log(`\toriginal: "${pkgJson.scripts[scriptName]}"`);
		}
		pkgJson.scripts[scriptName] = `rbxts-build ${scriptName}`;
	}

	await fs.writeFile(pkgJsonPath, JSON.stringify(pkgJson, undefined, 2));
}

export = identity<yargs.CommandModule>({ command, handler });
