import { exec, ExecException } from "child_process";
import { CLIError } from "../errors/CLIError";

export function cmd(cmdStr: string) {
	return new Promise<string>((resolve, reject) => {
		exec(cmdStr, (error, stdout, stderr) => {
			if (error) {
				reject(error);
			}
			resolve(stdout);
		});
	}).catch((error: ExecException) => {
		throw new CLIError(`Command "${error.cmd}" exited with code ${error.code}\n\n${error.message}`);
	});
}
