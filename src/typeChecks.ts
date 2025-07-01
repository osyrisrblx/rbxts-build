import * as z from "zod";
import { DEFAULT_STUDIO_WAIT_TIMEOUT } from "./constants";

export const SCRIPT_NAMES = ["build", "compile", "open", "start", "stop", "sync", "syncback", "watch"];

export const packageJsonType = z.object({
	"rbxts-build": z
		.object({
			dev: z.boolean().optional(),
			names: z.object(Object.fromEntries(SCRIPT_NAMES.map(name => [name, z.string().optional()]))).optional(),
			rbxtscArgs: z.array(z.string()).optional(),
			rojoBuildArgs: z.array(z.string()).optional(),
			syncLocation: z.string().optional(),
			studioWaitTimeout: z.number().min(1000).max(300000).optional().default(DEFAULT_STUDIO_WAIT_TIMEOUT),
			syncback: z.boolean().optional(),
			syncbackArgs: z.array(z.string()).optional(),
			useWindowsTemp: z.boolean().optional().default(false),
			watchOnOpen: z.boolean().optional(),
			windowsSavePath: z.string().optional(),
			wslUseExe: z.boolean().optional(),
		})
		.optional(),
});

export type packageJsonType = z.infer<typeof packageJsonType>;

export type RbxtsBuildSettings = NonNullable<packageJsonType["rbxts-build"]>;
