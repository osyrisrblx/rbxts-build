import { LoggableError } from "./LoggableError";
export declare class CLIError extends LoggableError {
    constructor(message?: string);
    toString(): string;
}
