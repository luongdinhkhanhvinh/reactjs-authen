import { AuthenticationInterface } from './interfaces/authenticationInterface';
import { UserReponse } from './models/authentication';
import { JwtConfigRequest } from './models/authentication/jwtConfigRequest';
import { SendEmailForgotPasswordRequest } from './models/authentication/sendEmailForgotPasswordRequest';
import { SendEmailVerifyRequest } from './models/authentication/sendEmailVerifyRequest';
import { UserSignupInfoRequest } from './models/authentication/userInfoSignupRequest';
import { UserLoginRequest } from './models/authentication/userLoginRequest';
import { UpdateProfileRequest } from './models/authentication/updateProfileRequest';
import { ChangePasswordRequest } from './models/authentication/changePasswordRequest';
export declare class Authentication {
    private authenticationClass;
    constructor(authenticationClass: AuthenticationInterface);
    signUp(userInfo: UserSignupInfoRequest, sendEmailVerifyParam: SendEmailVerifyRequest): Promise<UserReponse>;
    login(userLoginInfo: UserLoginRequest, jwtConfigRequest: JwtConfigRequest): Promise<object>;
    sendForgotPasswordEmail(request: SendEmailForgotPasswordRequest): Promise<void>;
    private checkPassword;
    generateHashPassword(password: string): Promise<string>;
    resendVerifyEmail(id: number, fromEmail: string, template: string, additional?: {
        [key: string]: any;
    }): Promise<void>;
    updateProfile(request: UpdateProfileRequest): Promise<UserReponse>;
    resetPassword(email: string, template: string, userType: string): Promise<void>;
    updatePassword(request: ChangePasswordRequest): Promise<void>;
    verifyAccount(userId: number, code: string): Promise<any>;
    private generateToken;
    renewToken(refreshToken: string, jwtConfigRequest: JwtConfigRequest): Promise<{
        token: string;
        refreshToken: string;
    }>;
}
