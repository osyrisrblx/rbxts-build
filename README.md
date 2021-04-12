# rbxts-build

An opinionated build orchestrator for [roblox-ts](https://roblox-ts.com)

## Usage

Requires Node.js v14 or later.

**rbxts-build** works by creating several scripts inside of your `package.json` file's "scripts" object.

- **compile**
	- `rbxtsc --verbose`
- **build**
	- `rojo build --output game.rbxlx`
- **open**
	- Launches Roblox Studio with `game.rbxlx`
- **start**
	- `npm run compile`
	- `npm run build`
	- `npm run open`
- **stop**
	- Force kills the Roblox Studio process
- **sync**
	- `rojo build --output game.rbxlx`
	- Uses `remodel` to generate a `src/services.d.ts` file for indexing existing children in roblox-ts.
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

You can use `rbxts-build init` to automatically setup these scripts for you. It's often useful to do the following when setting up a new roblox-ts project:
- `rbxtsc init`
- `rbxts-build init`

## Settings

**rbxts-build** allows for a few settings in `package.json` under a `"rbxts-build"` key:
```js
"rbxts-build": {
	// override arguments to rbxtsc, default provided below
	"rbxtscArgs": ["--verbose"],
	// override arguments to rojo build, default provided below
	"rojoBuildArgs": ["--output", "game.rbxlx"],
	// provide a relative file location for the sync command output
	"syncLocation": "src/services.d.ts",
	// use rbxtsc-dev instead of rbxtsc
	"dev": false,
},
```

## Hooks
You can run scripts before and after any **rbxts-build** script by editing your `package.json` scripts.

For example:
```json
"build": "echo 'pre-build command' && rbxts-build build && echo 'post-build command'",
```

## Assumptions

**rbxts-build** assumes a few things about your project's structure:
- Project must be a game which is fully managed by Rojo
- Scripts are run from your project directory (where `package.json` lives)
- If you're using WSL, `rojo` and `remodel` are installed inside of WSL, and not Windows.
	- Will add a setting for this to use .exe versions
