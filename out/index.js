#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const constants_1 = require("./constants");
const CLIError_1 = require("./errors/CLIError");
void yargs_1.default
    .usage("rbxts-build - A build tool for roblox-ts")
    .help("help")
    .alias("h", "help")
    .showHelpOnFail(false)
    .describe("help", "show help information")
    .version(constants_1.VERSION)
    .alias("v", "version")
    .commandDir(`${constants_1.PACKAGE_ROOT}/out/commands`)
    .recommendCommands()
    .strict()
    .wrap(yargs_1.default.terminalWidth())
    .fail((str, e) => {
    process.exitCode = 1;
    if (e instanceof CLIError_1.CLIError) {
        e.log();
    }
    else {
        if (str !== undefined && str !== null)
            console.log(str);
        if (e)
            console.log(e);
    }
    debugger;
})
    .parse();
//# sourceMappingURL=index.js.map