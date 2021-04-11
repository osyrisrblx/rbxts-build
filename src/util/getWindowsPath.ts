import { cmd } from "./cmd";
import { Lazy } from "./Lazy";

const rootWslPath = new Lazy(async () => {
	return (await cmd(`wslpath -w /`)).trim();
});

export async function getWindowsPath(fsPath: string) {
	return (await rootWslPath.get()) + fsPath.replace(/\\/g, "\\\\").replace(/\//g, "\\").slice(1);
}
