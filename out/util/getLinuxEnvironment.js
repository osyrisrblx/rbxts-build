"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinuxEnvironment = void 0;
const child_process_1 = require("child_process");
function getLinuxEnvironment() {
    try {
        const kernelRelease = (0, child_process_1.execSync)("uname -r", { encoding: "utf-8" }).trim();
        if (kernelRelease.toLowerCase().includes("microsoft")) {
            const procVersion = (0, child_process_1.execSync)("cat /proc/version", { encoding: "utf-8" }).trim();
            if (procVersion.toLowerCase().includes("wsl2")) {
                return "wsl2";
            }
            return "wsl1";
        }
        return "linux";
    }
    catch (error) {
        console.error("Error determining environment:", error);
        return undefined;
    }
}
exports.getLinuxEnvironment = getLinuxEnvironment;
//# sourceMappingURL=getLinuxEnvironment.js.map