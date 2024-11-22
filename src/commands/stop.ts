import fs from "fs/promises";
import path from "path";
import yargs from "yargs";
import { LOCKFILE_NAME } from "../constants";
import { identity } from "../util/identity";
import { run } from "../util/run";
import { runPlatform } from "../util/runPlatform";
import { getLinuxEnvironment } from "../util/getLinuxEnvironment";
import { execSync } from "child_process";
import { killProcess } from "../util/killLinuxProcess";

const command = "stop";

async function handler() {
	const projectPath = process.cwd();

	const lockFilePath = path.join(projectPath, LOCKFILE_NAME);

	try {
		const lockFileContents = (await fs.readFile(lockFilePath)).toString();
		const processId = lockFileContents.split("\n")[0];

		await runPlatform({
			darwin: () => run("kill", ["-9", processId]),
			linux: () => {
				const environment = getLinuxEnvironment()
				if (environment !== undefined && environment === "linux") {
					return killProcess("vinegar")
				} else {
					return run("taskkill.exe", ["/f", "/pid", processId])
				}
			},
			win32: () => run("taskkill", ["/f", "/pid", processId]),
		});
	} catch {}

	try {
		await fs.rm(lockFilePath);
	} catch {}
}

export = identity<yargs.CommandModule>({ command, handler });
