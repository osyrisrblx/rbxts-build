"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggableError = void 0;
class LoggableError extends Error {
    constructor(message) {
        super(message);
        debugger;
    }
    log() {
        console.log(this.toString());
    }
}
exports.LoggableError = LoggableError;
//# sourceMappingURL=LoggableError.js.map