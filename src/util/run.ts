import kleur from "kleur";
import { spawn, SpawnOptions } from "child_process";
import { CLIError } from "../errors/CLIError";
import { processManager } from "./processManager";

export async function run(
	command: string,
	args: ReadonlyArray<string> = [],
	options: SpawnOptions = {},
): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		console.log(kleur.yellow(command), ...args.map(kleur.yellow));
		const spawnOptions: SpawnOptions = { shell: true, ...options };
		const childProcess = spawn(command, args, spawnOptions);

		// Register process for cleanup
		processManager.register(childProcess, `${command} ${args.join(" ")}`);

		childProcess.stdout?.on("data", data => process.stdout.write(data));
		childProcess.stderr?.on("data", data => process.stderr.write(data));

		childProcess.on("error", err => {
			reject(new CLIError(`Failed to execute command "${command}": ${err.message}`));
		});

		childProcess.on("exit", code => {
			if (code === 0) {
				resolve();
			} else {
				reject(new CLIError(`Command "${command}" exited with code ${code}`));
			}
		});

		childProcess.on("close", code => {
			if (code === 0) {
				resolve();
			} else {
				reject(new CLIError(`Command "${command}" closed with code ${code}`));
			}
		});
	});
}
