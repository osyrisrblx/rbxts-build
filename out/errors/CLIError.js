"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIError = void 0;
const kleur_1 = __importDefault(require("kleur"));
const LoggableError_1 = require("./LoggableError");
class CLIError extends LoggableError_1.LoggableError {
    constructor(message) {
        super(message);
    }
    toString() {
        return `${kleur_1.default.red("CLIError")}: ${this.message}`;
    }
}
exports.CLIError = CLIError;
//# sourceMappingURL=CLIError.js.map