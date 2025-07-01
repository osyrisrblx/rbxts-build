import { cmd } from "./cmd";
import { pathCache } from "./operationCache";

export async function getWindowsPath(fsPath: string): Promise<string> {
	const cacheKey = `wsl-to-windows:${fsPath}`;
	return await pathCache.getOrCompute(
		cacheKey,
		async () => {
			return (await cmd(`wslpath -w ${fsPath}`)).trim().replace(/\\/g, "\\\\").replace(/\//g, "\\");
		},
		120000, // Cache for 2 minutes (paths are relatively stable)
	);
}
