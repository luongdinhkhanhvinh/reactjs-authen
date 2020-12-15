"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSignupInfoRequest = void 0;
const illegalParameterError_1 = require("../../errors/illegalParameterError");
const joi = require("joi");
const contants_1 = require("./contants");
class UserSignupInfoRequest {
    constructor(firstName, lastName, userName, password, email, userNameType, id, hashPassword, verifyCode, dateTimeVerifyCode, additional) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.userName = userName;
        this.password = password;
        this.email = email;
        this.userNameType = userNameType;
        this.id = id;
        this.hashPassword = hashPassword;
        this.verifyCode = verifyCode;
        this.dateTimeVerifyCode = dateTimeVerifyCode;
        this.additional = additional;
        UserSignupInfoRequest.validate(this);
    }
    static validate(request) {
        const { error } = UserSignupInfoRequest.SCHEMA.validate(request);
        if (error) {
            throw new illegalParameterError_1.IllegalParameterError('UserSignupInfo', 'validate', `Invalid provided values: ${error.message}`);
        }
    }
}
exports.UserSignupInfoRequest = UserSignupInfoRequest;
UserSignupInfoRequest.SCHEMA = joi
    .object({
    id: joi.number().optional(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    userNameType: joi.string().valid('phone', 'email', 'string').required(),
    password: joi.string().regex(contants_1.CONTANTS.REGEX_PASSWORD).required(),
    hashPassword: joi.string().optional(),
    email: joi.string().email().required(),
    verifyCode: joi.string().optional(),
    dateTimeVerifyCode: joi.string().optional(),
    additional: joi.object().optional(),
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
})
    .required();
//# sourceMappingURL=userInfoSignupRequest.js.map