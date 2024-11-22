import path from "path";
import yargs from "yargs";
import { PLACEFILE_NAME } from "../constants";
import { getSettings } from "../util/getSettings";
import { getCommandName } from "../util/getCommandName";
import { getWindowsPath } from "../util/getWindowsPath";
import { identity } from "../util/identity";
import { run } from "../util/run";
import { runPlatform } from "../util/runPlatform";
import { getLinuxEnvironment } from "../util/getLinuxEnvironment";

const command = "open";

async function handler() {
	const projectPath = process.cwd();
	const settings = await getSettings(projectPath);

	await runPlatform({
		darwin: () => run("open", [PLACEFILE_NAME]),
		linux: async () => {
			const environment = getLinuxEnvironment()
			if (environment !== undefined && environment === "linux") {
				run("xdg-open", [PLACEFILE_NAME])
			} else {
				const fsPath = await getWindowsPath(path.join(projectPath, PLACEFILE_NAME));
				return run("powershell.exe", ["/c", `start ${fsPath}`]);
			}
		},
		win32: () => run("start", [PLACEFILE_NAME]),
	});

	if (settings.watchOnOpen !== false) {
		await run("npm", ["run", getCommandName(settings, "watch"), "--silent"]);
	}
}

export = identity<yargs.CommandModule>({ command, handler });
