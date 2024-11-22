"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cmd = void 0;
const child_process_1 = require("child_process");
const CLIError_1 = require("../errors/CLIError");
function cmd(cmdStr) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(cmdStr, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            resolve(stdout);
        });
    }).catch((error) => {
        throw new CLIError_1.CLIError(`Command "${error.cmd}" exited with code ${error.code}\n\n${error.message}`);
    });
}
exports.cmd = cmd;
//# sourceMappingURL=cmd.js.map