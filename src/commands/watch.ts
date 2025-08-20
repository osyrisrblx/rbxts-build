import yargs from "yargs";
import { getSettings } from "../util/getSettings";
import { identity } from "../util/identity";
import { run } from "../util/run";
import { platform } from "../util/runPlatform";

const command = "watch";

async function handler() {
        const projectPath = process.cwd();
        const settings = await getSettings(projectPath);

        const rojo = platform === "linux" && settings.wslUseExe ? "rojo.exe" : "rojo";
        const rbxtsc = settings.dev ? "rbxtsc-dev" : "rbxtsc";
        run(rojo, ["serve"].concat(settings.rojoServeArgs ?? [])).catch(console.warn);
        run(rbxtsc, ["-w"].concat(settings.rbxtscArgs ?? [])).catch(console.warn);
}

export = identity<yargs.CommandModule>({ command, handler });
