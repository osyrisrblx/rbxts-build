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
- **stop**
	- Force kills the Roblox Studio process
- **sync**
	- `rojo build --output game.rbxl`
	- Uses `lune` to generate a `src/services.d.ts` file for indexing existing children in roblox-ts.
		- [Refer to this guide for more information](https://roblox-ts.com/docs/guides/indexing-children/)

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
	// run `rbxtsc -w` + `rojo serve` automatically after Studio opens, default provided below
	"watchOnOpen": true,
},
```

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
