# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

rbxts-build is an opinionated build orchestrator for roblox-ts projects. It's a CLI tool that manages the build process for Roblox TypeScript projects, including compilation, building, and syncing with Roblox Studio.

## Development Commands

### Building the Project
```bash
npm run build        # Compile TypeScript to JavaScript
npm run build-watch  # Watch mode for TypeScript compilation
```

### Testing/Development
```bash
npm run devlink     # Link the package locally for testing
```

## Architecture

### Core Structure

- **Commands** (`src/commands/`): Each file represents a CLI command (build, compile, open, start, stop, sync, watch, init, modeledit)
- **Utilities** (`src/util/`): Helper functions for command execution, platform detection, and settings management
- **Type System** (`src/typeChecks.ts`): Zod schemas for validating configuration
- **Entry Point** (`src/index.ts`): CLI setup using yargs

### Key Components

1. **Settings System**: Reads configuration from `package.json` under the `"rbxts-build"` key
2. **Command Execution**: Uses child process spawning to run external tools (rbxtsc, rojo, lune)
3. **Platform Detection**: Handles Windows/WSL-specific behavior for executables

### Available Settings

Settings are configured in the consuming project's `package.json`:
```json
{
  "rbxts-build": {
    "rbxtscArgs": ["--verbose"],
    "rojoBuildArgs": ["--output", "game.rbxl"],
    "syncLocation": "src/services.d.ts",
    "dev": false,
    "wslUseExe": false,
    "watchOnOpen": true,
    "names": {
      "build": "custom-build-name"
    }
  }
}
```

## Code Conventions

- **TypeScript**: Strict mode enabled, ES2019 target
- **Formatting**: Uses Prettier with tabs, 120 character line width, trailing commas
- **Linting**: ESLint with TypeScript plugin
- **Module Pattern**: CommonJS modules with default exports for command modules
- **Error Handling**: Custom CLIError class for user-facing errors

## External Dependencies

- **yargs**: CLI argument parsing and command routing
- **kleur**: Terminal color output
- **zod**: Runtime type validation for configuration

## Important Notes

- All commands assume the project is a Roblox game fully managed by Rojo
- Scripts are executed from the project directory (where package.json lives)
- The tool integrates with rbxtsc (roblox-ts compiler), rojo (project sync), and lune (Luau runtime)