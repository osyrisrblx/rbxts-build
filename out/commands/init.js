"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const kleur_1 = __importDefault(require("kleur"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const identity_1 = require("../util/identity");
const typeChecks_1 = require("../typeChecks");
const getSettings_1 = require("../util/getSettings");
const getCommandName_1 = require("../util/getCommandName");
const command = "init";
async function handler() {
    var _a;
    const projectPath = process.cwd();
    const pkgJsonPath = path_1.default.join(projectPath, "package.json");
    await promises_1.default.access(pkgJsonPath);
    const pkgJson = JSON.parse((await promises_1.default.readFile(pkgJsonPath)).toString());
    (_a = pkgJson.scripts) !== null && _a !== void 0 ? _a : (pkgJson.scripts = {});
    const settings = await (0, getSettings_1.getSettings)(projectPath);
    for (const defaultName of typeChecks_1.SCRIPT_NAMES) {
        const scriptName = (0, getCommandName_1.getCommandName)(settings, defaultName);
        if (pkgJson.scripts[scriptName] !== undefined) {
            console.log(kleur_1.default.yellow("warning:"), `package.json script "${scriptName}" already exists, overwriting!`);
            console.log(`\toriginal: "${pkgJson.scripts[scriptName]}"`);
        }
        pkgJson.scripts[scriptName] = `rbxts-build ${scriptName}`;
    }
    await promises_1.default.writeFile(pkgJsonPath, JSON.stringify(pkgJson, undefined, 2));
}
module.exports = (0, identity_1.identity)({ command, handler });
//# sourceMappingURL=init.js.map