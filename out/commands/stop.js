"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const constants_1 = require("../constants");
const identity_1 = require("../util/identity");
const run_1 = require("../util/run");
const runPlatform_1 = require("../util/runPlatform");
const getLinuxEnvironment_1 = require("../util/getLinuxEnvironment");
const killLinuxProcess_1 = require("../util/killLinuxProcess");
const command = "stop";
async function handler() {
    const projectPath = process.cwd();
    const lockFilePath = path_1.default.join(projectPath, constants_1.LOCKFILE_NAME);
    try {
        const lockFileContents = (await promises_1.default.readFile(lockFilePath)).toString();
        const processId = lockFileContents.split("\n")[0];
        await (0, runPlatform_1.runPlatform)({
            darwin: () => (0, run_1.run)("kill", ["-9", processId]),
            linux: () => {
                const environment = (0, getLinuxEnvironment_1.getLinuxEnvironment)();
                if (environment !== undefined && environment === "linux") {
                    return (0, killLinuxProcess_1.killProcess)("vinegar");
                }
                else {
                    return (0, run_1.run)("taskkill.exe", ["/f", "/pid", processId]);
                }
            },
            win32: () => (0, run_1.run)("taskkill", ["/f", "/pid", processId]),
        });
    }
    catch { }
    try {
        await promises_1.default.rm(lockFilePath);
    }
    catch { }
}
module.exports = (0, identity_1.identity)({ command, handler });
//# sourceMappingURL=stop.js.map