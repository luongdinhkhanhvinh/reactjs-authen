"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordRequest = void 0;
const illegalParameterError_1 = require("../../errors/illegalParameterError");
const joi = require("joi");
const contants_1 = require("./contants");
class ChangePasswordRequest {
    constructor(uid, code, password) {
        this.uid = uid;
        this.code = code;
        this.password = password;
        ChangePasswordRequest.validate(this);
    }
    static validate(request) {
        const { error } = ChangePasswordRequest.SCHEMA.validate(request);
        if (error) {
            throw new illegalParameterError_1.IllegalParameterError('ChangePasswordRequest', 'validate', `Invalid provided values: ${error.message}`);
        }
    }
}
exports.ChangePasswordRequest = ChangePasswordRequest;
ChangePasswordRequest.SCHEMA = joi
    .object({
    uid: joi.number().required(),
    code: joi.string().required(),
    password: joi.string().regex(contants_1.CONTANTS.REGEX_PASSWORD).required(),
})
    .required();
//# sourceMappingURL=changePasswordRequest.js.map