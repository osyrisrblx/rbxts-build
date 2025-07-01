/**
 * Validate Windows path for security issues
 */
export function validateWindowsPath(inputPath: string): void {
	if (!inputPath || typeof inputPath !== "string") {
		throw new Error("Path must be a non-empty string");
	}

	// Check for path traversal attempts
	if (inputPath.includes("..") || inputPath.includes("../") || inputPath.includes("..\\")) {
		throw new Error("Path traversal not allowed");
	}

	// Check for forbidden characters that could break PowerShell
	const forbiddenChars = ["'", "`", "$", ";", "&", "|", "<", ">", "(", ")", "{", "}", "[", "]"];
	for (const char of forbiddenChars) {
		if (inputPath.includes(char)) {
			throw new Error(`Invalid character '${char}' in path`);
		}
	}

	// Check length limits
	if (inputPath.length > 260) {
		throw new Error("Path exceeds maximum Windows path length");
	}

	// Ensure it looks like a valid Windows path
	if (!inputPath.match(/^[a-zA-Z]:[\\w\s.-]*$/) && !inputPath.match(/^\\\\[\w.-]+\\[\w\s.-]*$/)) {
		throw new Error("Invalid Windows path format");
	}
}

/**
 * Escape PowerShell special characters in paths
 */
export function escapePowerShellPath(inputPath: string): string {
	// Replace single quotes with double quotes for PowerShell safety
	return inputPath.replace(/'/g, "''");
}
