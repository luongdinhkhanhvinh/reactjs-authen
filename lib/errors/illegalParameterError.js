"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IllegalParameterError = void 0;
const httpBaseError_1 = require("./httpBaseError");
class IllegalParameterError extends httpBaseError_1.HttpBaseError {
    constructor(className, functionName, message) {
        super(className, functionName, 400, 'IllegalParameterError', message);
    }
}
exports.IllegalParameterError = IllegalParameterError;
//# sourceMappingURL=illegalParameterError.js.map