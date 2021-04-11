export abstract class LoggableError extends Error {
	constructor(message?: string) {
		super(message);
		debugger;
	}

	public abstract toString(): string;

	public log() {
		console.log(this.toString());
	}
}
