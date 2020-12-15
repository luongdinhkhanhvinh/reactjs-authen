"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileRequest = void 0;
const illegalParameterError_1 = require("../../errors/illegalParameterError");
const joi = require("joi");
const contants_1 = require("./contants");
class UpdateProfileRequest {
    constructor(id, firstName, lastName, profileImageId, currentPassword, password, hashPassword, additional) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.profileImageId = profileImageId;
        this.currentPassword = currentPassword;
        this.password = password;
        this.hashPassword = hashPassword;
        this.additional = additional;
        UpdateProfileRequest.validate(this);
    }
    static validate(request) {
        const { error } = UpdateProfileRequest.SCHEMA.validate(request);
        if (error) {
            throw new illegalParameterError_1.IllegalParameterError('UpdateProfileRequest', 'validate', `Invalid provided values: ${error.message}`);
        }
    }
}
exports.UpdateProfileRequest = UpdateProfileRequest;
UpdateProfileRequest.SCHEMA = joi
    .object({
    id: joi.number().required(),
    email: joi.string().email().optional(),
    firstName: joi.string().optional(),
    lastName: joi.string().optional(),
    profileImageId: joi.number().optional().allow(null),
    currentPassword: joi.string().regex(contants_1.CONTANTS.REGEX_PASSWORD).optional(),
    password: joi.string().regex(contants_1.CONTANTS.REGEX_PASSWORD).optional(),
    hashPassword: joi.string().optional(),
    additional: joi.object().optional(),
})
    .required();
//# sourceMappingURL=updateProfileRequest.js.map