import kleur from "kleur";
import { LoggableError } from "./LoggableError";

export class CLIError extends LoggableError {
	constructor(message?: string) {
		super(message);
	}

	public toString() {
		return `${kleur.red("CLIError")}: ${this.message}`;
	}
}
