export declare abstract class LoggableError extends Error {
    constructor(message?: string);
    abstract toString(): string;
    log(): void;
}
