import { TrackableSystemError } from './trackableSystemError';
export declare class HttpBaseError extends TrackableSystemError {
    readonly code: number;
    readonly reason: string;
    constructor(className: string, functionName: string, code: number, reason: string, message: string);
}
