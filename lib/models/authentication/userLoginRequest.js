"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLoginRequest = void 0;
const illegalParameterError_1 = require("../../errors/illegalParameterError");
const joi = require("joi");
class UserLoginRequest {
    constructor(userName, userNameType, password, additional) {
        this.userName = userName;
        this.userNameType = userNameType;
        this.password = password;
        this.additional = additional;
        UserLoginRequest.validate(this);
    }
    static validate(request) {
        const { error } = UserLoginRequest.SCHEMA.validate(request);
        if (error) {
            throw new illegalParameterError_1.IllegalParameterError('SendEmailVerifyRequest', 'validate', `Invalid provided values: ${error.message}`);
        }
    }
}
exports.UserLoginRequest = UserLoginRequest;
UserLoginRequest.SCHEMA = joi
    .object({
    userName: joi
        .any()
        .when('userNameType', { is: 'email', then: joi.string().email() })
        .when('userNameType', {
        is: 'phone',
        then: joi.string().regex(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/),
    })
        .when('userNameType', {
        is: 'normal',
        then: joi.string().regex(/^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/),
    })
        .required(),
    userNameType: joi.string().valid('phone', 'email', 'string').required(),
    password: joi.string().required(),
    additional: joi.object().optional(),
})
    .required();
//# sourceMappingURL=userLoginRequest.js.map