"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpBaseError = void 0;
const trackableSystemError_1 = require("./trackableSystemError");
class HttpBaseError extends trackableSystemError_1.TrackableSystemError {
    constructor(className, functionName, code, reason, message) {
        super(className, functionName, message);
        // Custom properties
        this.code = code || 500;
        this.reason = reason || 'InternalServerError';
    }
}
exports.HttpBaseError = HttpBaseError;
//# sourceMappingURL=httpBaseError.js.map