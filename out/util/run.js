"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const kleur_1 = __importDefault(require("kleur"));
const child_process_1 = require("child_process");
const CLIError_1 = require("../errors/CLIError");
function run(command, args = []) {
    return new Promise((resolve, reject) => {
        var _a, _b;
        console.log(kleur_1.default.yellow(command), ...args.map(kleur_1.default.yellow));
        const options = { shell: true };
        const childProcess = (0, child_process_1.spawn)(command, args, options);
        (_a = childProcess.stdout) === null || _a === void 0 ? void 0 : _a.on("data", data => process.stdout.write(data));
        (_b = childProcess.stderr) === null || _b === void 0 ? void 0 : _b.on("data", data => process.stderr.write(data));
        childProcess.on("error", err => {
            throw err;
        });
        childProcess.on("exit", code => {
            if (code === 0) {
                resolve();
            }
            else {
                reject(code);
            }
        });
        childProcess.on("close", code => {
            if (code === 0) {
                resolve();
            }
            else {
                reject(code);
            }
        });
    }).catch((code) => {
        throw new CLIError_1.CLIError(`Command "${command}" exited with code ${code}`);
    });
}
exports.run = run;
//# sourceMappingURL=run.js.map