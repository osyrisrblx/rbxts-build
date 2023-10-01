import yargs from "yargs";
import { MODEL_EXPORT_SCRIPT_PATH, MODEL_IMPORT_SCRIPT_PATH } from "../constants";
import { cmd } from "../util/cmd";
import { getWindowsPath } from "../util/getWindowsPath";
import { identity } from "../util/identity";
import { run } from "../util/run";
import { runPlatform } from "../util/runPlatform";

const command = "modeledit";

const handler = async (args: yargs.Arguments) => {
	let tmpFilePath = "";
	await runPlatform({
		linux: async () => {
			const tmpFolderPath = (await cmd("mktemp -d")).trim();
			tmpFilePath = `${tmpFolderPath}/modeledit.rbxl`;
		},
	});

	const inputArgs = args._.slice(1).map(v => String(v));
	await runPlatform({
		linux: async () => {
			for (let i = 0; i < inputArgs.length; i++) {
				inputArgs[i] = (await cmd(`realpath ${inputArgs[i]}`)).trim();
			}
		},
	});

	await runPlatform({
		linux: async () => {
			await run("lune", [MODEL_IMPORT_SCRIPT_PATH, tmpFilePath, ...inputArgs]);
			await run("powershell.exe", ["/c", `start -Wait ${await getWindowsPath(tmpFilePath)}`]);
			await run("lune", [MODEL_EXPORT_SCRIPT_PATH, tmpFilePath]);
		},
	});
};

const builder: yargs.CommandBuilder = () => yargs.command("[files..]", "");

export = identity<yargs.CommandModule>({ command, builder, handler });
