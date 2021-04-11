import path from "path";

export const PACKAGE_ROOT = path.join(__dirname, "..");

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
export const VERSION: string = require("../package.json").version;

export const PLACEFILE_NAME = "game.rbxlx";
export const LOCKFILE_NAME = PLACEFILE_NAME + ".lock";

export const SYNC_SCRIPT_PATH = path.join(PACKAGE_ROOT, "scripts", "sync.lua");
