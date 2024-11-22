export declare function getSettings(projectPath: string): Promise<{
    rbxtscArgs?: string[] | undefined;
    rojoBuildArgs?: string[] | undefined;
    syncLocation?: string | undefined;
    wslUseExe?: boolean | undefined;
    dev?: boolean | undefined;
    watchOnOpen?: boolean | undefined;
    names?: {
        [x: string]: string | undefined;
    } | undefined;
}>;
