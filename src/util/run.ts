import { spawn } from "child_process";
import kleur from "kleur";
import { CLIError } from "../errors/CLIError";
import path from "path";

function getPathKey(env: NodeJS.ProcessEnv) {
	for (const key of Object.keys(env)) {
		if (key.toLowerCase() === "path") return key;
	}
	return "PATH";
}

function injectLocalNodeModulesBin(env: NodeJS.ProcessEnv) {
	let dir = process.cwd();
	const paths = new Array<string>();
	while (true) {
		paths.push(path.resolve(dir, "node_modules", ".bin"));
		const parent = path.dirname(dir);
		if (parent === dir) break;
		dir = parent;
	}
	const pathKey = getPathKey(env);
	const existing = env[pathKey];
	if (existing) {
		paths.push(existing);
	}
	env[pathKey] = paths.join(path.delimiter);
}

export function run(command: string, args: ReadonlyArray<string> = []) {
	return new Promise<void>((resolve, reject) => {
		console.log(kleur.yellow(command), ...args.map(kleur.yellow));
		const env: NodeJS.ProcessEnv = { ...process.env };
		injectLocalNodeModulesBin(env);
		spawn(command, args, { shell: false, env, stdio: "inherit" })
			.once("error", err => reject(new CLIError((err as Error).message)))
			.once("close", code =>
				code === 0 ? resolve() : reject(new CLIError(`Command "${command}" exited with code ${code}`)),
			);
	});
}
