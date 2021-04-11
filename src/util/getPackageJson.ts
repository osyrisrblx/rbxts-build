import fs from "fs";
import path from "path";
import { packageJsonType } from "../typeChecks";

export function getPackageJson(projectPath: string) {
	const pkgJsonPath = path.join(projectPath, "package.json");
	try {
		const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath).toString());
		if (packageJsonType.check(pkgJson)) {
			return pkgJson;
		}
	} catch {}
}
