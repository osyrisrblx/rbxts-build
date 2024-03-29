import kleur from "kleur";
import { spawn, SpawnOptions } from "child_process";
import { CLIError } from "../errors/CLIError";

export function run(command: string, args: ReadonlyArray<string> = []) {
	return new Promise<void>((resolve, reject) => {
		console.log(kleur.yellow(command), ...args.map(kleur.yellow));
		const options: SpawnOptions = { shell: true };
		const childProcess = spawn(command, args, options);
		childProcess.stdout?.on("data", data => process.stdout.write(data));
		childProcess.stderr?.on("data", data => process.stderr.write(data));
		childProcess.on("error", err => {
			throw err;
		});
		childProcess.on("exit", code => {
			if (code === 0) {
				resolve();
			} else {
				reject(code);
			}
		});
		childProcess.on("close", code => {
			if (code === 0) {
				resolve();
			} else {
				reject(code);
			}
		});
	}).catch((code: number) => {
		throw new CLIError(`Command "${command}" exited with code ${code}`);
	});
}
