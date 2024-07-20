import { packageJsonType } from "../typeChecks";
import fs from "fs/promises";
import path from "path";

export async function getSettings(projectPath: string) {
	const pkgJsonPath = path.join(projectPath, "package.json");
	const pkgJsonContents = (await fs.readFile(pkgJsonPath)).toString();
	const pkgJson = packageJsonType.parse(JSON.parse(pkgJsonContents));
	return pkgJson?.["rbxts-build"] ?? {};
}

export function getCommandName(settings: packageJsonType["rbxts-build"], command: string) {
	return settings?.names?.[command] ?? command;
}
