import { exec, ExecException } from "child_process";
import { CLIError } from "../errors/CLIError";
import { processManager } from "./processManager";

export async function cmd(cmdStr: string, registerForCleanup: boolean = false): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		const childProcess = exec(cmdStr, (error, stdout) => {
			if (error) {
				const execError = error as ExecException;
				reject(
					new CLIError(
						`Command "${execError.cmd}" exited with code ${execError.code}\n\n${execError.message}`,
					),
				);
				return;
			}
			resolve(stdout);
		});

		if (registerForCleanup) {
			processManager.register(childProcess, `exec: ${cmdStr}`);
		}
	});
}
