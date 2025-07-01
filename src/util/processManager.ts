import { ChildProcess } from "child_process";

interface RegisteredInterval {
	id: NodeJS.Timeout;
	description?: string;
}

/**
 * Global process lifecycle manager for proper cleanup
 */
export class ProcessManager {
	private processes = new Set<ChildProcess>();
	private intervals = new Map<NodeJS.Timeout, RegisteredInterval>();
	private isShuttingDown = false;
	private cleanupPromise: Promise<void> | null = null;

	/**
	 * Register a child process for tracking and cleanup
	 */
	public register(process: ChildProcess, description?: string): void {
		if (this.isShuttingDown) {
			console.warn("ProcessManager is shutting down, cannot register new process");
			return;
		}

		this.processes.add(process);

		// Auto-remove when process exits
		process.on("exit", () => {
			this.processes.delete(process);
		});

		if (description) {
			console.debug(`Registered process: ${description} (PID: ${process.pid})`);
		}
	}

	/**
	 * Register an interval for cleanup
	 */
	public registerInterval(interval: NodeJS.Timeout, description?: string): void {
		if (this.isShuttingDown) {
			console.warn("ProcessManager is shutting down, cannot register new interval");
			clearInterval(interval);
			return;
		}

		this.intervals.set(interval, { id: interval, description });

		if (description) {
			console.debug(`Registered interval: ${description}`);
		}
	}

	/**
	 * Unregister an interval (when manually cleared)
	 */
	public unregisterInterval(interval: NodeJS.Timeout): void {
		this.intervals.delete(interval);
	}

	/**
	 * Get current process and interval counts
	 */
	public getStats(): { processes: number; intervals: number } {
		return {
			processes: this.processes.size,
			intervals: this.intervals.size,
		};
	}

	/**
	 * Cleanup all tracked resources
	 */
	async cleanup(): Promise<void> {
		if (this.cleanupPromise) {
			return this.cleanupPromise;
		}

		this.isShuttingDown = true;

		this.cleanupPromise = this.performCleanup();
		return this.cleanupPromise;
	}

	private async performCleanup(): Promise<void> {
		console.log("ProcessManager: Starting cleanup...");

		// Clear all intervals first
		for (const [interval, info] of this.intervals.entries()) {
			clearInterval(interval);
			if (info.description) {
				console.debug(`Cleared interval: ${info.description}`);
			}
		}

		this.intervals.clear();

		// Terminate all processes
		const processCleanupPromises: Array<Promise<void>> = [];

		for (const process of this.processes) {
			if (process.killed || process.exitCode !== null) {
				continue;
			}

			processCleanupPromises.push(this.terminateProcess(process));
		}

		// Wait for all processes to terminate (with timeout)
		try {
			await Promise.race([
				Promise.all(processCleanupPromises),
				new Promise(resolve => setTimeout(resolve, 5000)), // 5 second timeout
			]);
		} catch (error) {
			console.warn("Some processes may not have terminated cleanly:", error);
		}

		this.processes.clear();
		console.log("ProcessManager: Cleanup completed");
	}

	private async terminateProcess(process: ChildProcess): Promise<void> {
		return new Promise<void>(resolve => {
			if (process.killed || process.exitCode !== null) {
				resolve();
				return;
			}

			const timeout = setTimeout(() => {
				if (!process.killed) {
					console.warn(`Force killing process ${process.pid}`);
					process.kill("SIGKILL");
				}
				resolve();
			}, 3000);

			process.on("exit", () => {
				clearTimeout(timeout);
				resolve();
			});

			// Try graceful termination first
			try {
				process.kill("SIGTERM");
			} catch (error) {
				// Process might already be dead
				clearTimeout(timeout);
				resolve();
			}
		});
	}
}

// Global process manager instance
export const processManager = new ProcessManager();

// Track if signal handlers are already setup
let signalHandlersSetup = false;

// Setup signal handlers for graceful shutdown
function setupSignalHandlers() {
	if (signalHandlersSetup) {
		return; // Already setup, prevent duplicates
	}

	signalHandlersSetup = true;

	const signals: Array<NodeJS.Signals> = ["SIGINT", "SIGTERM", "SIGQUIT"];

	for (const signal of signals) {
		process.on(signal, async () => {
			console.log(`\nReceived ${signal}, cleaning up...`);
			await processManager.cleanup();
			process.exit(0);
		});
	}

	// Handle uncaught exceptions
	process.on("uncaughtException", async error => {
		console.error("Uncaught exception:", error);
		await processManager.cleanup();
		process.exit(1);
	});

	// Handle unhandled promise rejections
	process.on("unhandledRejection", async (reason, promise) => {
		console.error("Unhandled rejection at:", promise, "reason:", reason);
		await processManager.cleanup();
		process.exit(1);
	});
}

// Export setup function for commands that need it
export { setupSignalHandlers };
