import path from "path";

export const PACKAGE_ROOT = path.join(__dirname, "..");

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
export const VERSION: string = require("../package.json").version;

export const PLACEFILE_NAME = "game.rbxl";
export const LOCKFILE_NAME = PLACEFILE_NAME + ".lock";

export const SYNC_SCRIPT_PATH = path.join(PACKAGE_ROOT, "scripts", "sync.luau");
export const SYNCBACK_SCRIPT_PATH = path.join(PACKAGE_ROOT, "scripts", "syncback.luau");
export const MODEL_IMPORT_SCRIPT_PATH = path.join(PACKAGE_ROOT, "scripts", "model_import.luau");
export const MODEL_EXPORT_SCRIPT_PATH = path.join(PACKAGE_ROOT, "scripts", "model_export.luau");

export const WSL_SYNC_POLL_INTERVAL = 2000; // 2 seconds
export const DEFAULT_STUDIO_WAIT_TIMEOUT = 60000; // 60 seconds
export const WSL_PROGRESS_UPDATE_INTERVAL = 10000; // Show progress every 10 seconds
export const WSL_RBXTS_BUILD_SUBDIR = "rbxts-build"; // Subdirectory name in Windows temp
