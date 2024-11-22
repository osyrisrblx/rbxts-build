"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWindowsPath = void 0;
const cmd_1 = require("./cmd");
async function getWindowsPath(fsPath) {
    return (await (0, cmd_1.cmd)(`wslpath -w ${fsPath}`)).trim().replace(/\\/g, "\\\\").replace(/\//g, "\\");
}
exports.getWindowsPath = getWindowsPath;
//# sourceMappingURL=getWindowsPath.js.map