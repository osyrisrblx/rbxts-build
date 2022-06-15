import { cmd } from "./cmd";

export async function getWindowsPath(fsPath: string) {
	return (await cmd(`wslpath -w ${fsPath}`)).trim().replace(/\\/g, "\\\\").replace(/\//g, "\\");
}
