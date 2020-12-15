import { HttpBaseError } from './httpBaseError';
export declare class ForbiddenError extends HttpBaseError {
    constructor(className: string, functionName: string, message?: string);
}
