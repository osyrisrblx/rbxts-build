# rbxts-build

An opinionated build orchestrator for [roblox-ts](https://roblox-ts.com)

## Usage

Requires Node.js v14 or later.

**rbxts-build** works by creating several scripts inside of your `package.json` file's "scripts" object.

You can use `rbxts-build init` to automatically setup these scripts for you. It's often useful to do the following when setting up a new roblox-ts project:
- `rbxtsc init`
- `npm install -D rbxts-build`
- `npx rbxts-build init`

- **compile**
	- `rbxtsc --verbose`
- **build**
	- `rojo build --output game.rbxl`
- **open**
	- Launches Roblox Studio with `game.rbxl`
- **start**
	- `npm run compile`
	- `npm run build`
	- `npm run open`
	- In a headless session, opens Studio without automatically starting the watch processes
- **stop**
	- Force kills the Roblox Studio process
	- Moves the Studio auto-recovery file left by the killed session into `.rbxts-build/recovery/` so the next launch does not show the auto-recovery prompt ([details](#auto-recovery))
- **sync**
	- `rojo build --output game.rbxl`
	- Uses `lune` to generate a `src/services.d.ts` file for indexing existing children in roblox-ts.
		- [Refer to this guide for more information](https://roblox-ts.com/docs/guides/indexing-children/)
- **watch**
	- Runs `rbxtsc --watch` and `rojo serve`

These scripts should be structured in your `package.json` file as:
```json
"scripts": {
	"build": "rbxts-build build",
	"open": "rbxts-build open",
	"start": "rbxts-build start",
	"stop": "rbxts-build stop",
	"sync": "rbxts-build sync"
},
```

From there, you can use `npm start`, to launch your project.

Once you've started working, it's convenient to use `npm restart` (or `npm res` for short) to run `npm stop` and then `npm start`.

### Headless usage

`rbxts-build start` considers the session headless when stdin or stdout is not attached to an interactive terminal. It still compiles, builds, and opens `game.rbxl` for tools such as Studio MCP, but it does not automatically start `rbxtsc --watch` or `rojo serve`.

Use `npm start -- --watch` to start the watch processes in a headless session, or `npm start -- --no-watch` to suppress them explicitly. Running the `open` or `watch` commands directly preserves their normal behavior. Run `npx rbxts-build --help` or `npx rbxts-build <command> --help` for command-specific details.

## Settings

**rbxts-build** allows for a few settings in `package.json` under a `"rbxts-build"` key:
```js
"rbxts-build": {
	// override arguments to rbxtsc, default provided below
	"rbxtscArgs": ["--verbose"],
	// override arguments to rojo build, default provided below
	"rojoBuildArgs": ["--output", "game.rbxl"],
	// provide a relative file location for the sync command output, default provided below
	"syncLocation": "src/services.d.ts",
	// use rbxtsc-dev instead of rbxtsc, default provided below
	"dev": false,
	// WSL-only, use .exe versions of rojo and lune, default provided below
	"wslUseExe": false,
	// run `rbxtsc -w` + `rojo serve` automatically after Studio opens (unless `start` is headless)
	"watchOnOpen": true,
	// what `stop` does with the auto-recovery file from the Studio session it killed: "move", "delete", or "keep", default provided below
	"autoRecovery": "move",
	// optionally provide a list of names to replace with their default values, an example is provided below
	"names": {
		"build": "dev:build",
		"compile": "dev:compile",
		"open": "dev:open",
		"watch": "dev:watch"
	}
},
```

## Auto-recovery

Studio deletes its auto-recovery files only when it closes normally. Because `stop` force kills Studio, the next `npm start` would otherwise offer to recover a stale copy of `game.rbxl`, which is a build output.

After `stop` kills Studio, it looks for this place's auto-recovery files (`game_AutoRecovery_*.rbxl`) that were written during the killed session, and handles them according to the `autoRecovery` setting:
- `"move"` (default): moves them into `.rbxts-build/recovery/`, keeping the 5 most recent. They are normal place files, so open one in Studio if you need to get back changes you made in Studio. The folder has its own `.gitignore`.
- `"delete"`: deletes them.
- `"keep"`: leaves them in place, so Studio shows the auto-recovery prompt as usual.

Use `npm stop -- --recovery <mode>` to override the setting for a single run.

Files from earlier sessions (for example, a real Studio crash) and files for other places are never touched, and nothing happens if `stop` did not kill a Studio process. The following AutoSaves folders are checked:
- Windows: `%LOCALAPPDATA%\Roblox\RobloxStudio\AutoSaves` and `%USERPROFILE%\Documents\ROBLOX\AutoSaves`
- macOS: `~/Library/Application Support/Roblox/RobloxStudio/AutoSaves` and `~/Documents/ROBLOX/AutoSaves`
- WSL: the Windows folders above, located through `powershell.exe`

## Hooks
You can run scripts before and after any **rbxts-build** script by adding new `package.json` scripts with `pre-` or `post-` suffixes.

For example:
```json
"precompile": "echo 'pre-build command'",
"postcompile": "echo 'post-build command'",
```

npm will execute this as:
1. `precompile`
1. `compile`
1. `postcompile`

## Assumptions

**rbxts-build** assumes a few things about your project's structure:
- Project must be a game which is fully managed by Rojo
- Scripts are run from your project directory (where `package.json` lives)
