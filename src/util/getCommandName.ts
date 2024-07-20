import { packageJsonType } from "../typeChecks";

export function getCommandName(settings: packageJsonType["rbxts-build"], command: string) {
	return settings?.names?.[command] ?? command;
}
