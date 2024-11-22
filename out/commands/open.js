"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const constants_1 = require("../constants");
const getSettings_1 = require("../util/getSettings");
const getCommandName_1 = require("../util/getCommandName");
const getWindowsPath_1 = require("../util/getWindowsPath");
const identity_1 = require("../util/identity");
const run_1 = require("../util/run");
const runPlatform_1 = require("../util/runPlatform");
const getLinuxEnvironment_1 = require("../util/getLinuxEnvironment");
const command = "open";
async function handler() {
    const projectPath = process.cwd();
    const settings = await (0, getSettings_1.getSettings)(projectPath);
    await (0, runPlatform_1.runPlatform)({
        darwin: () => (0, run_1.run)("open", [constants_1.PLACEFILE_NAME]),
        linux: async () => {
            const environment = (0, getLinuxEnvironment_1.getLinuxEnvironment)();
            if (environment !== undefined && environment === "linux") {
                (0, run_1.run)("xdg-open", [constants_1.PLACEFILE_NAME]);
            }
            else {
                const fsPath = await (0, getWindowsPath_1.getWindowsPath)(path_1.default.join(projectPath, constants_1.PLACEFILE_NAME));
                return (0, run_1.run)("powershell.exe", ["/c", `start ${fsPath}`]);
            }
        },
        win32: () => (0, run_1.run)("start", [constants_1.PLACEFILE_NAME]),
    });
    if (settings.watchOnOpen !== false) {
        await (0, run_1.run)("npm", ["run", (0, getCommandName_1.getCommandName)(settings, "watch"), "--silent"]);
    }
}
module.exports = (0, identity_1.identity)({ command, handler });
//# sourceMappingURL=open.js.map