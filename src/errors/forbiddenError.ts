import { HttpBaseError } from './httpBaseError';

export class ForbiddenError extends HttpBaseError {
  constructor(className: string, functionName: string, message: string = 'Access Denied/Forbidden') {
    super(className, functionName, 403, 'ForbiddenError', message);
  }
}
