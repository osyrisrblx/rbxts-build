import * as z from "zod";

export const packageJsonType = z.object({
	"rbxts-build": z
		.object({
			rbxtscArgs: z.array(z.string()).optional(),
			rojoBuildArgs: z.array(z.string()).optional(),
			syncLocation: z.string().optional(),
			wslUseExe: z.boolean().optional(),
			dev: z.boolean().optional(),
			watchOnOpen: z.boolean().optional(),
			prefix: z.string().optional(),
		})
		.optional(),
});

export type packageJsonType = z.infer<typeof packageJsonType>;
