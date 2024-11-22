"use strict";
const identity_1 = require("../util/identity");
const run_1 = require("../util/run");
const getSettings_1 = require("../util/getSettings");
const getCommandName_1 = require("../util/getCommandName");
const command = "start";
async function handler() {
    const projectPath = process.cwd();
    const settings = await (0, getSettings_1.getSettings)(projectPath);
    await (0, run_1.run)("npm", ["run", (0, getCommandName_1.getCommandName)(settings, "compile"), "--silent"]);
    await (0, run_1.run)("npm", ["run", (0, getCommandName_1.getCommandName)(settings, "build"), "--silent"]);
    await (0, run_1.run)("npm", ["run", (0, getCommandName_1.getCommandName)(settings, "open"), "--silent"]);
}
module.exports = (0, identity_1.identity)({ command, handler });
//# sourceMappingURL=start.js.map