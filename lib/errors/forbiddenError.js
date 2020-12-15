"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = void 0;
const httpBaseError_1 = require("./httpBaseError");
class ForbiddenError extends httpBaseError_1.HttpBaseError {
    constructor(className, functionName, message = 'Access Denied/Forbidden') {
        super(className, functionName, 403, 'ForbiddenError', message);
    }
}
exports.ForbiddenError = ForbiddenError;
//# sourceMappingURL=forbiddenError.js.map