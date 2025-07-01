import { packageJsonType, RbxtsBuildSettings } from "../typeChecks";
import fs from "fs/promises";
import path from "path";

export async function getSettings(projectPath: string): Promise<RbxtsBuildSettings> {
	const pkgJsonPath = path.join(projectPath, "package.json");
	const pkgJsonContents = (await fs.readFile(pkgJsonPath)).toString();
	const pkgJson = packageJsonType.parse(JSON.parse(pkgJsonContents));
	// Apply default values by parsing with the schema
	const defaultSettings = { "rbxts-build": pkgJson?.["rbxts-build"] ?? {} };
	return packageJsonType.parse(defaultSettings)["rbxts-build"]!;
}
