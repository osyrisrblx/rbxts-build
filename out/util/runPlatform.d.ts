/// <reference types="node" />
export declare const platform: NodeJS.Platform;
export declare function runPlatform<R>(callbacks: {
    [T in NodeJS.Platform]?: () => R;
}): R;
