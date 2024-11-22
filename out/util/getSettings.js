"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = void 0;
const typeChecks_1 = require("../typeChecks");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
async function getSettings(projectPath) {
    var _a;
    const pkgJsonPath = path_1.default.join(projectPath, "package.json");
    const pkgJsonContents = (await promises_1.default.readFile(pkgJsonPath)).toString();
    const pkgJson = typeChecks_1.packageJsonType.parse(JSON.parse(pkgJsonContents));
    return (_a = pkgJson === null || pkgJson === void 0 ? void 0 : pkgJson["rbxts-build"]) !== null && _a !== void 0 ? _a : {};
}
exports.getSettings = getSettings;
//# sourceMappingURL=getSettings.js.map