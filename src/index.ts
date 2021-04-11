#!/usr/bin/env node

import chalk from "chalk";
import yargs from "yargs";
import { PACKAGE_ROOT, VERSION } from "./constants";
import { CLIError } from "./errors/CLIError";

chalk.level = 3;

yargs
	.usage("rbxts-build - A build tool for roblox-ts")
	.help("help")
	.alias("h", "help")
	.showHelpOnFail(false)
	.describe("help", "show help information")

	// version
	.version(VERSION)
	.alias("v", "version")

	// commands
	.commandDir(`${PACKAGE_ROOT}/out/commands`)

	// options
	.recommendCommands()
	.strict()
	.wrap(yargs.terminalWidth())

	.fail((str, e) => {
		process.exitCode = 1;
		if (e instanceof CLIError) {
			e.log();
		} else {
			if (str !== undefined && str !== null) console.log(str);
			if (e) console.log(e);
		}
		debugger;
	})

	// execute
	.parse();
