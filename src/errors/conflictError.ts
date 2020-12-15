import { HttpBaseError } from './httpBaseError';

export class ConflictError extends HttpBaseError {
  constructor(className: string, functionName: string, message: string) {
    super(className, functionName, 409, 'DuplicatedError', message);
  }
}
