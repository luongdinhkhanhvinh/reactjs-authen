"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
const httpBaseError_1 = require("./httpBaseError");
class UnauthorizedError extends httpBaseError_1.HttpBaseError {
    constructor(className, functionName, message = UnauthorizedError.message) {
        super(className, functionName, 401, 'UnauthorizedError', message);
    }
}
exports.UnauthorizedError = UnauthorizedError;
UnauthorizedError.message = 'Unauthorized: Access is denied due to invalid credentials.';
//# sourceMappingURL=unauthorizedError.js.map