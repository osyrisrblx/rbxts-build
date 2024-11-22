import * as z from "zod";
export declare const SCRIPT_NAMES: string[];
export declare const packageJsonType: z.ZodObject<{
    "rbxts-build": z.ZodOptional<z.ZodObject<{
        rbxtscArgs: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        rojoBuildArgs: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        syncLocation: z.ZodOptional<z.ZodString>;
        wslUseExe: z.ZodOptional<z.ZodBoolean>;
        dev: z.ZodOptional<z.ZodBoolean>;
        watchOnOpen: z.ZodOptional<z.ZodBoolean>;
        names: z.ZodOptional<z.ZodObject<{
            [k: string]: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            [x: string]: string | undefined;
        }, {
            [x: string]: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        rbxtscArgs?: string[] | undefined;
        rojoBuildArgs?: string[] | undefined;
        syncLocation?: string | undefined;
        wslUseExe?: boolean | undefined;
        dev?: boolean | undefined;
        watchOnOpen?: boolean | undefined;
        names?: {
            [x: string]: string | undefined;
        } | undefined;
    }, {
        rbxtscArgs?: string[] | undefined;
        rojoBuildArgs?: string[] | undefined;
        syncLocation?: string | undefined;
        wslUseExe?: boolean | undefined;
        dev?: boolean | undefined;
        watchOnOpen?: boolean | undefined;
        names?: {
            [x: string]: string | undefined;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    "rbxts-build"?: {
        rbxtscArgs?: string[] | undefined;
        rojoBuildArgs?: string[] | undefined;
        syncLocation?: string | undefined;
        wslUseExe?: boolean | undefined;
        dev?: boolean | undefined;
        watchOnOpen?: boolean | undefined;
        names?: {
            [x: string]: string | undefined;
        } | undefined;
    } | undefined;
}, {
    "rbxts-build"?: {
        rbxtscArgs?: string[] | undefined;
        rojoBuildArgs?: string[] | undefined;
        syncLocation?: string | undefined;
        wslUseExe?: boolean | undefined;
        dev?: boolean | undefined;
        watchOnOpen?: boolean | undefined;
        names?: {
            [x: string]: string | undefined;
        } | undefined;
    } | undefined;
}>;
export type packageJsonType = z.infer<typeof packageJsonType>;
