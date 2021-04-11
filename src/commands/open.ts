import path from "path";
import yargs from "yargs";
import { PLACEFILE_NAME } from "../constants";
import { getWindowsPath } from "../util/getWindowsPath";
import { identity } from "../util/identity";
import { run } from "../util/run";
import { runPlatform } from "../util/runPlatform";

const command = "open";

async function handler() {
	const projectPath = process.cwd();

	await runPlatform({
		linux: async () => {
			const fsPath = await getWindowsPath(path.join(projectPath, PLACEFILE_NAME));
			return run("powershell.exe", ["/c", `start ${fsPath}`]);
		},
		win32: () => run("start", [PLACEFILE_NAME]),
	});
}

export = identity<yargs.CommandModule>({ command, handler });
