import { execSync } from "child_process";
import { getLinuxEnvironment } from "./getLinuxEnvironment";
import { CLIError } from "../errors/CLIError";
import internal from "stream";

export function killProcess(processName: string) {
    return new Promise<void>((resolve, reject) => {
        const environment = getLinuxEnvironment()
        if (environment !== undefined && environment !== "linux")
            return reject()

        // Find the process ID(s) of the process
        const pids = execSync(`pgrep -f ${processName}`, { encoding: "utf-8" })
        .split("\n")
        .filter(pid => pid.trim() !== "");

        if (pids.length === 0) {
            console.log(`No processes found with name: ${processName}`);
            return reject();
        }

        // Kill each PID
        pids.forEach(pid => {
            console.log(`Killing process with PID: ${pid}`);
            execSync(`kill -9 ${pid}`);
        });

        console.log(`All processes matching '${processName}' have been terminated.`);
        resolve()
    }).catch(() => {
        throw new CLIError(`Error occurred while killing a process ${processName}`)
    }) 
}


export function killPid(pid: string) {
    return new Promise<void>((resolve, reject) => {
        const environment = getLinuxEnvironment()
        if (environment !== undefined && environment !== "linux")
            return reject()

        console.log(`Killing process with PID: ${pid}`);
        execSync(`kill -9 ${pid}`);
        resolve()
    }).catch(() => {
        throw new CLIError(`Error occurred while killing a process ${pid}`)
    }) 
}
