import fs from "fs/promises";
import path from "path";
import yargs from "yargs";
import { LOCKFILE_NAME } from "../constants";
import { identity } from "../util/identity";
import { run } from "../util/run";
import { runPlatform } from "../util/runPlatform";

const command = "stop";

async function handler() {
	const projectPath = process.cwd();

	const lockFilePath = path.join(projectPath, LOCKFILE_NAME);

	try {
		const lockFileContents = (await fs.readFile(lockFilePath)).toString();
		const processId = lockFileContents.split("\n")[0];

		await runPlatform({
			darwin: () => run("kill", [processId]),
			linux: () => run("taskkill.exe", ["/f", "/pid", processId]),
			win32: () => run("taskkill", ["/f", "/pid", processId]),
		});
	} catch {}

	try {
		await fs.rm(lockFilePath);
	} catch {}
}

export = identity<yargs.CommandModule>({ command, handler });
