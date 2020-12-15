"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackableSystemError = void 0;
class TrackableSystemError extends Error {
    constructor(className, functionName, message) {
        // Call parent constructor
        super(message);
        // Saving class name in the property of our custom error as a shortcut
        this.name = this.constructor.name;
        // Capturing stack trace, excluding constructor call from it.
        Error.captureStackTrace(this, this.constructor);
        // Custom properties
        this.className = className;
        this.functionName = functionName;
    }
}
exports.TrackableSystemError = TrackableSystemError;
//# sourceMappingURL=trackableSystemError.js.map