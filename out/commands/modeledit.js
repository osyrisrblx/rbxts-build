"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const yargs_1 = __importDefault(require("yargs"));
const constants_1 = require("../constants");
const cmd_1 = require("../util/cmd");
const getWindowsPath_1 = require("../util/getWindowsPath");
const identity_1 = require("../util/identity");
const run_1 = require("../util/run");
const runPlatform_1 = require("../util/runPlatform");
const command = "modeledit";
const handler = async (args) => {
    let tmpFilePath = "";
    await (0, runPlatform_1.runPlatform)({
        linux: async () => {
            const tmpFolderPath = (await (0, cmd_1.cmd)("mktemp -d")).trim();
            tmpFilePath = `${tmpFolderPath}/modeledit.rbxl`;
        },
    });
    const inputArgs = args._.slice(1).map(v => String(v));
    await (0, runPlatform_1.runPlatform)({
        linux: async () => {
            for (let i = 0; i < inputArgs.length; i++) {
                inputArgs[i] = (await (0, cmd_1.cmd)(`realpath ${inputArgs[i]}`)).trim();
            }
        },
    });
    await (0, runPlatform_1.runPlatform)({
        linux: async () => {
            await (0, run_1.run)("lune", ["run", constants_1.MODEL_IMPORT_SCRIPT_PATH, tmpFilePath, ...inputArgs]);
            await (0, run_1.run)("powershell.exe", ["/c", `start -Wait ${await (0, getWindowsPath_1.getWindowsPath)(tmpFilePath)}`]);
            await (0, run_1.run)("lune", ["run", constants_1.MODEL_EXPORT_SCRIPT_PATH, tmpFilePath]);
        },
    });
};
const builder = () => yargs_1.default.command("[files..]", "");
module.exports = (0, identity_1.identity)({ command, builder, handler });
//# sourceMappingURL=modeledit.js.map