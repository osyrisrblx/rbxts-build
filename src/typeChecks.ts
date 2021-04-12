import * as z from "zod";

export const packageJsonType = z.object({
	scripts: z.object({
		build: z.string().optional(),
		start: z.string().optional(),
		stop: z.string().optional(),
	}),
	"rbxts-build": z.object({
		rbxtscArgs: z.array(z.string()).optional(),
		rojoBuildArgs: z.array(z.string()).optional(),
		syncLocation: z.string().optional(),
		wslUseExe: z.boolean().optional(),
		dev: z.boolean().optional(),
	}),
});

export type packageJsonType = z.infer<typeof packageJsonType>;
