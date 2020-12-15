import { TrackableSystemError } from './trackableSystemError';

export class HttpBaseError extends TrackableSystemError {
  public readonly code: number;
  public readonly reason: string;

  constructor(className: string, functionName: string, code: number, reason: string, message: string) {
    super(className, functionName, message);

    // Custom properties
    this.code = code || 500;
    this.reason = reason || 'InternalServerError';
  }
}
