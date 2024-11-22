"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.killProcess = void 0;
const child_process_1 = require("child_process");
const getLinuxEnvironment_1 = require("./getLinuxEnvironment");
const CLIError_1 = require("../errors/CLIError");
function killProcess(processName) {
    return new Promise((resolve, reject) => {
        const environment = (0, getLinuxEnvironment_1.getLinuxEnvironment)();
        if (environment !== undefined && environment !== "linux")
            return reject();
        const pids = (0, child_process_1.execSync)(`pgrep -f ${processName}`, { encoding: "utf-8" })
            .split("\n")
            .filter(pid => pid.trim() !== "");
        if (pids.length === 0) {
            console.log(`No processes found with name: ${processName}`);
            return reject();
        }
        pids.forEach(pid => {
            console.log(`Killing process with PID: ${pid}`);
            (0, child_process_1.execSync)(`kill -9 ${pid}`);
        });
        console.log(`All processes matching '${processName}' have been terminated.`);
        resolve();
    }).catch(() => {
        throw new CLIError_1.CLIError(`Error occurred while killing a process ${processName}`);
    });
}
exports.killProcess = killProcess;
//# sourceMappingURL=killLinuxProcess.js.map