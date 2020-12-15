import { HttpBaseError } from './httpBaseError';
export declare class UnauthorizedError extends HttpBaseError {
    private static message;
    constructor(className: string, functionName: string, message?: string);
}
