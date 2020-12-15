import { HttpBaseError } from './httpBaseError';
export declare class ConflictError extends HttpBaseError {
    constructor(className: string, functionName: string, message: string);
}
