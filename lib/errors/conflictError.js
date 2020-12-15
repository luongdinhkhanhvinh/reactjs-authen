"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = void 0;
const httpBaseError_1 = require("./httpBaseError");
class ConflictError extends httpBaseError_1.HttpBaseError {
    constructor(className, functionName, message) {
        super(className, functionName, 409, 'DuplicatedError', message);
    }
}
exports.ConflictError = ConflictError;
//# sourceMappingURL=conflictError.js.map