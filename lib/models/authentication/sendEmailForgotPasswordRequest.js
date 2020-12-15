"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendEmailForgotPasswordRequest = void 0;
const illegalParameterError_1 = require("../../errors/illegalParameterError");
const joi = require("joi");
class SendEmailForgotPasswordRequest {
    constructor(fromEmail, toEmail, htmlTemplate, param) {
        this.fromEmail = fromEmail;
        this.toEmail = toEmail;
        this.htmlTemplate = htmlTemplate;
        this.param = param;
        SendEmailForgotPasswordRequest.validate(this);
    }
    static validate(request) {
        const { error } = SendEmailForgotPasswordRequest.SCHEMA.validate(request);
        if (error) {
            throw new illegalParameterError_1.IllegalParameterError('SendEmailForgotPasswordRequest', 'validate', `Invalid provided values: ${error.message}`);
        }
    }
}
exports.SendEmailForgotPasswordRequest = SendEmailForgotPasswordRequest;
SendEmailForgotPasswordRequest.SCHEMA = joi
    .object({
    fromEmail: joi.string().email().optional().allow('', null),
    toEmail: joi.string().email().required(),
    htmlTemplate: joi.string().optional().allow('', null),
    param: joi
        .object({
        id: joi.number().required(),
        firstName: joi.string().optional(),
        lastName: joi.string().optional(),
        verifyCode: joi.string().optional(),
        dateTimeVerifyCode: joi.date().optional(),
    })
        .required(),
})
    .required();
//# sourceMappingURL=sendEmailForgotPasswordRequest.js.map