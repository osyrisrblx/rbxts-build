"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPlatform = exports.platform = void 0;
const os_1 = __importDefault(require("os"));
exports.platform = os_1.default.platform();
function runPlatform(callbacks) {
    const callback = callbacks[exports.platform];
    if (callback) {
        return callback();
    }
    throw `Callback not implemented for platform ${exports.platform}!`;
}
exports.runPlatform = runPlatform;
//# sourceMappingURL=runPlatform.js.map