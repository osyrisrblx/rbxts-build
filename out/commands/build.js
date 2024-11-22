"use strict";
const constants_1 = require("../constants");
const getSettings_1 = require("../util/getSettings");
const identity_1 = require("../util/identity");
const run_1 = require("../util/run");
const runPlatform_1 = require("../util/runPlatform");
const command = "build";
async function handler() {
    var _a;
    const projectPath = process.cwd();
    const settings = await (0, getSettings_1.getSettings)(projectPath);
    const rojo = runPlatform_1.platform === "linux" && settings.wslUseExe ? "rojo.exe" : "rojo";
    await (0, run_1.run)(rojo, ["build", ...((_a = settings.rojoBuildArgs) !== null && _a !== void 0 ? _a : ["--output", constants_1.PLACEFILE_NAME])]);
}
module.exports = (0, identity_1.identity)({ command, handler });
//# sourceMappingURL=build.js.map