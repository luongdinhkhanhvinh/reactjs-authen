"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendEmailVerifyRequest = void 0;
const illegalParameterError_1 = require("../../errors/illegalParameterError");
const joi = require("joi");
class SendEmailVerifyRequest {
    constructor(fromEmail, toEmail, htmlTemplate, param) {
        this.fromEmail = fromEmail;
        this.toEmail = toEmail;
        this.htmlTemplate = htmlTemplate;
        this.param = param;
        SendEmailVerifyRequest.validate(this);
    }
    static validate(request) {
        const { error } = SendEmailVerifyRequest.SCHEMA.validate(request);
        if (error) {
            throw new illegalParameterError_1.IllegalParameterError('SendEmailVerifyRequest', 'validate', `Invalid provided values: ${error.message}`);
        }
    }
}
exports.SendEmailVerifyRequest = SendEmailVerifyRequest;
SendEmailVerifyRequest.SCHEMA = joi
    .object({
    fromEmail: joi.string().email().optional().allow('', null),
    toEmail: joi.string().email().optional().allow('', null),
    htmlTemplate: joi.string().optional().allow('', null),
    param: joi
        .object({
        id: joi.number().optional(),
        firstName: joi.string().optional(),
        lastName: joi.string().optional(),
        verifyCode: joi.string().optional(),
        dateTimeVerifyCode: joi.date().optional(),
    })
        .optional(),
})
    .required();
//# sourceMappingURL=sendEmailVerifyRequest.js.map