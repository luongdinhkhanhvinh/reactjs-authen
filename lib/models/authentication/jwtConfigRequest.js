"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtConfigRequest = void 0;
const illegalParameterError_1 = require("../../errors/illegalParameterError");
const joi = require("joi");
class JwtConfigRequest {
    constructor(jwtPrivateKey, jwtExpriresIn, jwtRefreshKey) {
        this.jwtPrivateKey = jwtPrivateKey;
        this.jwtExpriresIn = jwtExpriresIn;
        this.jwtRefreshKey = jwtRefreshKey;
        JwtConfigRequest.validate(this);
    }
    static validate(request) {
        const { error } = JwtConfigRequest.SCHEMA.validate(request);
        if (error) {
            throw new illegalParameterError_1.IllegalParameterError('UserSignupInfo', 'validate', `Invalid provided values: ${error.message}`);
        }
    }
}
exports.JwtConfigRequest = JwtConfigRequest;
JwtConfigRequest.SCHEMA = joi
    .object({
    jwtPrivateKey: joi.string().required(),
    jwtExpriresIn: joi.number().required(),
    jwtRefreshKey: joi.string().required(),
})
    .required();
//# sourceMappingURL=jwtConfigRequest.js.map