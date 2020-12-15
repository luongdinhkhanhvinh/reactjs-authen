"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authentication = void 0;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const conflictError_1 = require("./errors/conflictError");
const illegalParameterError_1 = require("./errors/illegalParameterError");
const authentication_1 = require("./models/authentication");
const sendEmailForgotPasswordRequest_1 = require("./models/authentication/sendEmailForgotPasswordRequest");
const sendEmailVerifyRequest_1 = require("./models/authentication/sendEmailVerifyRequest");
const forbiddenError_1 = require("./errors/forbiddenError");
class Authentication {
    constructor(authenticationClass) {
        this.authenticationClass = authenticationClass;
    }
    signUp(userInfo, sendEmailVerifyParam) {
        return __awaiter(this, void 0, void 0, function* () {
            const userIsExist = yield this.authenticationClass.checkUserExist(userInfo);
            if (userIsExist) {
                throw new conflictError_1.ConflictError('Authentication', 'signUp', 'User is existing!');
            }
            const hashPassword = yield this.generateHashPassword(userInfo.password);
            userInfo.hashPassword = hashPassword;
            const user = yield this.authenticationClass.saveUser(userInfo);
            userInfo.id = user.id;
            const verifyCode = yield this.authenticationClass.generateVerifyCode(userInfo);
            userInfo.verifyCode = verifyCode;
            sendEmailVerifyParam.param = {
                id: userInfo.id,
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                verifyCode: userInfo.verifyCode,
                dateTimeVerifyCode: new Date(),
            };
            yield this.authenticationClass.sendVerifyEmail(sendEmailVerifyParam);
            return user;
        });
    }
    login(userLoginInfo, jwtConfigRequest) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.authenticationClass.getUserByUserName(userLoginInfo.userName, (_a = userLoginInfo.additional) === null || _a === void 0 ? void 0 : _a.userType);
            if (!user) {
                throw new conflictError_1.ConflictError('Authentication', 'login', 'Sorry, there is no user matching the provided email. Please try again.');
            }
            yield this.authenticationClass.preAuthen(user);
            const isCorrectPassword = yield this.checkPassword(userLoginInfo.password, user.hashPassword);
            if (!isCorrectPassword) {
                throw new illegalParameterError_1.IllegalParameterError('Authentication', 'login', 'Sorry, the password is incorrect. Please try again.');
            }
            const invalid = yield this.authenticationClass.checkUserValid(user, authentication_1.CHECK_USER_VALID_CASE.LOGIN);
            if (invalid) {
                return {
                    id: user.id,
                    email: user.email,
                    userStatus: user.userStatus,
                    message: invalid,
                };
            }
            const token = yield this.generateToken(user, jwtConfigRequest, (_b = userLoginInfo.additional) === null || _b === void 0 ? void 0 : _b.userType);
            yield this.authenticationClass.postLoginSuccess(user);
            return token;
        });
    }
    sendForgotPasswordEmail(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.authenticationClass.getUserByEmail(request.toEmail);
            if (!user) {
                throw new conflictError_1.ConflictError('Authentication', 'login', 'User does not exist!');
            }
            // await this.authenticationClass.generateForgotPasswordCode(request);
        });
    }
    checkPassword(password, hashPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt.compare(password, hashPassword);
        });
    }
    generateHashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashPassword = bcrypt.hashSync(password, salt);
            return hashPassword;
        });
    }
    resendVerifyEmail(id, fromEmail, template, additional) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.authenticationClass.getById(id);
            const error = yield this.authenticationClass.checkUserValid(user, authentication_1.CHECK_USER_VALID_CASE.RESEND_VERIFY);
            if (error) {
                throw new conflictError_1.ConflictError('Authentication', 'resendVerifyEmail', error);
            }
            const verifyCode = yield this.authenticationClass.generateVerifyCode(user, additional);
            const sendEmailVerifyParam = new sendEmailVerifyRequest_1.SendEmailVerifyRequest(fromEmail, user.email, template, {
                verifyCode,
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                dateTimeVerifyCode: new Date(),
            });
            this.authenticationClass.sendVerifyEmail(sendEmailVerifyParam);
        });
    }
    updateProfile(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.authenticationClass.getById(request.id);
            if (!user) {
                throw new illegalParameterError_1.IllegalParameterError('Authentication', 'updateProfile', 'User not found!');
            }
            if (request.currentPassword && request.password) {
                const isCorrectPassword = yield this.checkPassword(request.currentPassword, user.hashPassword);
                if (!isCorrectPassword) {
                    throw new illegalParameterError_1.IllegalParameterError('Authentication', 'updateProfile', 'Wrong password!');
                }
                request.hashPassword = yield this.generateHashPassword(request.password);
            }
            return this.authenticationClass.updateProfile(request);
        });
    }
    resetPassword(email, template, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.authenticationClass.getUserByUserName(email, userType);
            const error = yield this.authenticationClass.checkUserValid(user, authentication_1.CHECK_USER_VALID_CASE.RESET_PASSWORD);
            if (error) {
                throw new conflictError_1.ConflictError('Authentication', 'resendVerifyEmail', error);
            }
            yield this.authenticationClass.preResetPassword(user);
            const verifyCode = yield this.authenticationClass.generateForgotPasswordCode(user);
            const emailParams = new sendEmailForgotPasswordRequest_1.SendEmailForgotPasswordRequest('', email, template, {
                verifyCode,
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                dateTimeVerifyCode: new Date(),
            });
            yield this.authenticationClass.sendEmailForgotPassword(emailParams);
        });
    }
    updatePassword(request) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authenticationClass.validateVerifyCode({ id: request.uid, code: request.code });
            const hashPassword = yield this.generateHashPassword(request.password);
            yield this.authenticationClass.updatePassword(request.uid, hashPassword);
        });
    }
    verifyAccount(userId, code) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authenticationClass.validateVerifyCode({ code, id: userId });
            return this.authenticationClass.verifyAccount(userId, code);
        });
    }
    generateToken(user, jwtConfigRequest, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenPayload = yield this.authenticationClass.getTokenPayLoad(user);
            const token = jwt.sign(tokenPayload, jwtConfigRequest.jwtPrivateKey, {
                expiresIn: jwtConfigRequest.jwtExpriresIn,
            });
            const refreshPayload = {
                userType,
                userName: user.userName,
            };
            const refreshToken = jwt.sign(refreshPayload, jwtConfigRequest.jwtRefreshKey, {
                expiresIn: jwtConfigRequest.jwtExpriresIn + 3600,
            });
            return { token, refreshToken };
        });
    }
    renewToken(refreshToken, jwtConfigRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenPayload = jwt.verify(refreshToken, jwtConfigRequest.jwtRefreshKey);
                const user = yield this.authenticationClass.getUserByUserName(tokenPayload.userName, tokenPayload.userType);
                return this.generateToken(user, jwtConfigRequest, tokenPayload.userType);
            }
            catch (err) {
                throw new forbiddenError_1.ForbiddenError('Authentication', 'renewToken', 'Invalid refresh token');
            }
        });
    }
}
exports.Authentication = Authentication;
//# sourceMappingURL=authentication.js.map