"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODEL_EXPORT_SCRIPT_PATH = exports.MODEL_IMPORT_SCRIPT_PATH = exports.SYNC_SCRIPT_PATH = exports.LOCKFILE_NAME = exports.PLACEFILE_NAME = exports.VERSION = exports.PACKAGE_ROOT = void 0;
const path_1 = __importDefault(require("path"));
exports.PACKAGE_ROOT = path_1.default.join(__dirname, "..");
exports.VERSION = require("../package.json").version;
exports.PLACEFILE_NAME = "game.rbxl";
exports.LOCKFILE_NAME = exports.PLACEFILE_NAME + ".lock";
exports.SYNC_SCRIPT_PATH = path_1.default.join(exports.PACKAGE_ROOT, "scripts", "sync.luau");
exports.MODEL_IMPORT_SCRIPT_PATH = path_1.default.join(exports.PACKAGE_ROOT, "scripts", "model_import.luau");
exports.MODEL_EXPORT_SCRIPT_PATH = path_1.default.join(exports.PACKAGE_ROOT, "scripts", "model_export.luau");
//# sourceMappingURL=constants.js.map