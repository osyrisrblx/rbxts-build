import fs from "fs/promises";
import kleur from "kleur";
import path from "path";
import yargs from "yargs";
import { LOCKFILE_NAME } from "../constants";
import { AUTO_RECOVERY_MODES, AutoRecoveryMode, handleAutoRecovery } from "../util/autoRecovery";
import { getSettings } from "../util/getSettings";
import { identity } from "../util/identity";
import { run } from "../util/run";
import { runPlatform } from "../util/runPlatform";

const command = "stop";
const describe = "Force-stop Roblox Studio for game.rbxl";

interface StopArgs {
	recovery?: AutoRecoveryMode;
}

const builder: yargs.CommandBuilder<Record<string, never>, StopArgs> = {
	recovery: {
		choices: AUTO_RECOVERY_MODES,
		description:
			"What to do with the Studio auto-recovery file left by the killed session (defaults to autoRecovery)",
	},
};

async function handler(args: yargs.Arguments<StopArgs>) {
	const projectPath = process.cwd();

	const lockFilePath = path.join(projectPath, LOCKFILE_NAME);

	// when the killed Studio session started, or undefined if nothing was killed
	let sessionStart: number | undefined;

	try {
		const lockFileContents = (await fs.readFile(lockFilePath)).toString();
		const lockFileStat = await fs.stat(lockFilePath);
		const processId = lockFileContents.split("\n")[0];

		await runPlatform({
			darwin: () => run("kill", ["-9", processId]),
			linux: () => run("taskkill.exe", ["/f", "/pid", processId]),
			win32: () => run("taskkill", ["/f", "/pid", processId]),
		});

		sessionStart =
			lockFileStat.birthtimeMs > 0
				? Math.min(lockFileStat.birthtimeMs, lockFileStat.mtimeMs)
				: lockFileStat.mtimeMs;
	} catch {}

	try {
		await fs.rm(lockFilePath);
	} catch {}

	if (sessionStart === undefined) return;

	const settings = await getSettings(projectPath).catch(() => undefined);
	const mode = args.recovery ?? settings?.autoRecovery ?? "move";
	if (mode === "keep") return;

	try {
		await handleAutoRecovery(projectPath, mode, sessionStart);
	} catch (e) {
		console.log(kleur.yellow("warning:"), `Failed to ${mode} Studio auto-recovery file:`, String(e));
	}
}

export = identity<yargs.CommandModule<Record<string, never>, StopArgs>>({ command, describe, builder, handler });
