import { HttpBaseError } from './httpBaseError';

export class IllegalParameterError extends HttpBaseError {
  constructor(className: string, functionName: string, message: string) {
    super(className, functionName, 400, 'IllegalParameterError', message);
  }
}
