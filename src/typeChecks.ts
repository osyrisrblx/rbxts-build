import * as z from "zod";

export const SCRIPT_NAMES = ["compile", "build", "open", "start", "stop", "sync", "watch"];

export const packageJsonType = z.object({
	"rbxts-build": z
		.object({
			dev: z.boolean().optional(),
			names: z.object(Object.fromEntries(SCRIPT_NAMES.map(name => [name, z.string().optional()]))).optional(),
			rbxtscArgs: z.array(z.string()).optional(),
			rojoBuildArgs: z.array(z.string()).optional(),
			syncLocation: z.string().optional(),
			useWindowsTemp: z.boolean().optional().default(false),
			watchOnOpen: z.boolean().optional(),
			windowsSavePath: z.string().optional(),
			wslUseExe: z.boolean().optional(),
		})
		.optional(),
});

export type packageJsonType = z.infer<typeof packageJsonType>;

export type RbxtsBuildSettings = NonNullable<packageJsonType["rbxts-build"]>;
