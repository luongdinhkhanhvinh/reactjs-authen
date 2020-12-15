import { HttpBaseError } from './httpBaseError';
export declare class IllegalParameterError extends HttpBaseError {
    constructor(className: string, functionName: string, message: string);
}
