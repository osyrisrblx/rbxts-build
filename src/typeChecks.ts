import * as z from "zod";

export const packageJsonType = z
	.object({
		scripts: z
			.object({
				compile: z.string().optional(),
				build: z.string().optional(),
				open: z.string().optional(),
				start: z.string().optional(),
				stop: z.string().optional(),
				sync: z.string().optional(),
			})
			.nonstrict(),
		"rbxts-build": z.object({
			rbxtscArgs: z.array(z.string()).optional(),
			rojoBuildArgs: z.array(z.string()).optional(),
			syncLocation: z.string().optional(),
			wslUseExe: z.boolean().optional(),
			dev: z.boolean().optional(),
		}),
	})
	.nonstrict();

export type packageJsonType = z.infer<typeof packageJsonType>;
