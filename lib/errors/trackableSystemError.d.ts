export declare class TrackableSystemError extends Error {
    readonly className: string;
    readonly functionName: string;
    constructor(className: string, functionName: string, message: string);
}
