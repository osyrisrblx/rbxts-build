import chalk from "chalk";
import { LoggableError } from "./LoggableError";

export class CLIError extends LoggableError {
	constructor(message?: string) {
		super(message);
	}

	public toString() {
		return `${chalk.red("CLIError")}: ${this.message}`;
	}
}
