import * as z from "zod";
import { AUTO_RECOVERY_MODES } from "./util/autoRecovery";

export const SCRIPT_NAMES = ["compile", "build", "open", "start", "stop", "sync", "watch"];

export const packageJsonType = z.object({
	"rbxts-build": z
		.object({
			rbxtscArgs: z.array(z.string()).optional(),
			rojoBuildArgs: z.array(z.string()).optional(),
			syncLocation: z.string().optional(),
			wslUseExe: z.boolean().optional(),
			dev: z.boolean().optional(),
			watchOnOpen: z.boolean().optional(),
			autoRecovery: z.enum(AUTO_RECOVERY_MODES).optional(),
			names: z.object(Object.fromEntries(SCRIPT_NAMES.map(name => [name, z.string().optional()]))).optional(),
		})
		.optional(),
});

export type packageJsonType = z.infer<typeof packageJsonType>;
