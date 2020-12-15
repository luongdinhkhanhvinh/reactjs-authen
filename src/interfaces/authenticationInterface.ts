import {
  SendEmailForgotPasswordRequest,
  SendEmailVerifyRequest,
  UserReponse,
  UserSignupInfoRequest,
  UpdateProfileRequest,
} from '../models/authentication/index';

export interface AuthenticationInterface {
  checkUserExist(request: UserSignupInfoRequest): Promise<boolean>;
  saveUser(request: UserSignupInfoRequest): Promise<UserReponse>;
  generateVerifyCode(request: UserSignupInfoRequest | UserReponse, additional?: {[key: string]: string}): Promise<string>;
  validateVerifyCode(request: any | undefined): Promise<boolean>;
  sendVerifyEmail(request: SendEmailVerifyRequest): Promise<boolean>;
  getUserByUserName(userName: string, userType: string): Promise<UserReponse>;
  getUserByEmail(email: string): Promise<UserReponse>;
  generateForgotPasswordCode(request: UserReponse): Promise<string>;
  sendEmailForgotPassword(request: SendEmailForgotPasswordRequest): Promise<void>;
  checkUserValid(user: UserReponse, usecase: string): Promise<string>;
  getById(id: number): Promise<UserReponse>;
  getTokenPayLoad(user: UserReponse): Promise<object>;
  postLoginSuccess(user: UserReponse): Promise<void>;
  preAuthen(user: UserReponse): Promise<void>;
  updateProfile(request: UpdateProfileRequest): Promise<UserReponse>;
  preResetPassword(user: UserReponse): Promise<void>;
  updatePassword(id: number, password: string): Promise<void>;
  verifyAccount(userId: number, code: string): Promise<any>;
}
