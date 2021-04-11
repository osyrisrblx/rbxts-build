import { packageJsonType } from "../typeChecks";

export function getSettings(pkgJson: packageJsonType | undefined) {
	return pkgJson?.["rbxts-build"] ?? {};
}
