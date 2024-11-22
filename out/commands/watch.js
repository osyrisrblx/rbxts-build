"use strict";
const getSettings_1 = require("../util/getSettings");
const identity_1 = require("../util/identity");
const run_1 = require("../util/run");
const runPlatform_1 = require("../util/runPlatform");
const command = "watch";
async function handler() {
    var _a;
    const projectPath = process.cwd();
    const settings = await (0, getSettings_1.getSettings)(projectPath);
    const rojo = runPlatform_1.platform === "linux" && settings.wslUseExe ? "rojo.exe" : "rojo";
    const rbxtsc = settings.dev ? "rbxtsc-dev" : "rbxtsc";
    (0, run_1.run)(rojo, ["serve"]).catch(console.warn);
    (0, run_1.run)(rbxtsc, ["-w"].concat((_a = settings.rbxtscArgs) !== null && _a !== void 0 ? _a : [])).catch(console.warn);
}
module.exports = (0, identity_1.identity)({ command, handler });
//# sourceMappingURL=watch.js.map