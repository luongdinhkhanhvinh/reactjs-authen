import { HttpBaseError } from './httpBaseError';

export class UnauthorizedError extends HttpBaseError {
  private static message = 'Unauthorized: Access is denied due to invalid credentials.';
  constructor(className: string, functionName: string, message: string = UnauthorizedError.message) {
    super(className, functionName, 401, 'UnauthorizedError', message);
  }
}
