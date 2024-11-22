"use strict";
const getSettings_1 = require("../util/getSettings");
const identity_1 = require("../util/identity");
const run_1 = require("../util/run");
const command = "compile";
async function handler() {
    var _a;
    const projectPath = process.cwd();
    const settings = await (0, getSettings_1.getSettings)(projectPath);
    const rbxtsc = settings.dev ? "rbxtsc-dev" : "rbxtsc";
    await (0, run_1.run)(rbxtsc, (_a = settings.rbxtscArgs) !== null && _a !== void 0 ? _a : ["--verbose"]);
}
module.exports = (0, identity_1.identity)({ command, handler });
//# sourceMappingURL=compile.js.map