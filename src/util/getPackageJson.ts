import fs from "fs";
import path from "path";
import { packageJsonType } from "../typeChecks";

export function getPackageJson(projectPath: string) {
	const pkgJsonPath = path.join(projectPath, "package.json");
	const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath).toString());
	return packageJsonType.parse(pkgJson);
}
