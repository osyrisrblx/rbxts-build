import os from "os";

export const platform = os.platform();

export function runPlatform<R>(callbacks: { [T in NodeJS.Platform]?: () => R }) {
	const callback = callbacks[platform];
	if (callback) {
		return callback();
	}
	throw `Callback not implemented for platform ${platform}!`;
}
