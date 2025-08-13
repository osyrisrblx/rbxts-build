import { execSync } from "child_process";

export function getLinuxEnvironment(): "wsl2" | "wsl1" | "linux" | undefined {
    try {
        // Execute `uname -r` to get the kernel release
        const kernelRelease = execSync("uname -r", { encoding: "utf-8" }).trim();

        // Check if "Microsoft" is in the kernel release (indicates WSL)
        if (kernelRelease.toLowerCase().includes("microsoft")) {
            // Check for WSL 2 specifics
            const procVersion = execSync("cat /proc/version", { encoding: "utf-8" }).trim();
            if (procVersion.toLowerCase().includes("wsl2")) {
                return "wsl2";
            }
            return "wsl1";
        }

        // If "Microsoft" is not present, assume regular Linux
        return "linux";
    } catch (error) {
        console.error("Error determining environment:", error);
        return undefined;
    }
}
