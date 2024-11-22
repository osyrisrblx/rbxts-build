"use strict";
const constants_1 = require("../constants");
const getSettings_1 = require("../util/getSettings");
const getCommandName_1 = require("../util/getCommandName");
const getWindowsPath_1 = require("../util/getWindowsPath");
const identity_1 = require("../util/identity");
const run_1 = require("../util/run");
const runPlatform_1 = require("../util/runPlatform");
const command = "sync";
async function handler() {
    var _a;
    const projectPath = process.cwd();
    const settings = await (0, getSettings_1.getSettings)(projectPath);
    await (0, run_1.run)("npm", ["run", (0, getCommandName_1.getCommandName)(settings, "build"), "--silent"]);
    const outPath = (_a = settings.syncLocation) !== null && _a !== void 0 ? _a : "src/services.d.ts";
    if (runPlatform_1.platform === "linux" && settings.wslUseExe) {
        const syncScriptPath = await (0, getWindowsPath_1.getWindowsPath)(constants_1.SYNC_SCRIPT_PATH);
        await (0, run_1.run)("lune.exe", ["run", syncScriptPath, constants_1.PLACEFILE_NAME, outPath]);
    }
    else {
        await (0, run_1.run)("lune", ["run", constants_1.SYNC_SCRIPT_PATH, constants_1.PLACEFILE_NAME, outPath]);
    }
}
module.exports = (0, identity_1.identity)({ command, handler });
//# sourceMappingURL=sync.js.map