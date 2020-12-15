import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConflictError } from './errors/conflictError';
import { IllegalParameterError } from './errors/illegalParameterError';
import { AuthenticationInterface } from './interfaces/authenticationInterface';
import { CHECK_USER_VALID_CASE, UserReponse } from './models/authentication';
import { JwtConfigRequest } from './models/authentication/jwtConfigRequest';
import { SendEmailForgotPasswordRequest } from './models/authentication/sendEmailForgotPasswordRequest';
import { SendEmailVerifyRequest } from './models/authentication/sendEmailVerifyRequest';
import { UserSignupInfoRequest } from './models/authentication/userInfoSignupRequest';
import { UserLoginRequest } from './models/authentication/userLoginRequest';
import { UpdateProfileRequest } from './models/authentication/updateProfileRequest';
import { ChangePasswordRequest } from './models/authentication/changePasswordRequest';
import { UnauthorizedError } from './errors/unauthorizedError';
import { ForbiddenError } from './errors/forbiddenError';

export class Authentication {
  private authenticationClass: AuthenticationInterface;
  constructor(authenticationClass: AuthenticationInterface) {
    this.authenticationClass = authenticationClass;
  }

  public async signUp(userInfo: UserSignupInfoRequest, sendEmailVerifyParam: SendEmailVerifyRequest) {
    const userIsExist = await this.authenticationClass.checkUserExist(userInfo);
    if (userIsExist) {
      throw new ConflictError('Authentication', 'signUp', 'User is existing!');
    }

    const hashPassword = await this.generateHashPassword(userInfo.password);
    userInfo.hashPassword = hashPassword;

    const user = await this.authenticationClass.saveUser(userInfo);
    userInfo.id = user.id;
    const verifyCode = await this.authenticationClass.generateVerifyCode(userInfo);
    userInfo.verifyCode = verifyCode;

    sendEmailVerifyParam.param = {
      id: userInfo.id,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      verifyCode: userInfo.verifyCode,
      dateTimeVerifyCode: new Date(),
    };
    await this.authenticationClass.sendVerifyEmail(sendEmailVerifyParam);
    return user;
  }

  public async login(userLoginInfo: UserLoginRequest, jwtConfigRequest: JwtConfigRequest): Promise<object> {
    const user = await this.authenticationClass.getUserByUserName(
      userLoginInfo.userName,
      userLoginInfo.additional?.userType,
    );
    if (!user) {
      throw new ConflictError(
        'Authentication',
        'login',
        'Sorry, there is no user matching the provided email. Please try again.',
      );
    }
    await this.authenticationClass.preAuthen(user);
    const isCorrectPassword = await this.checkPassword(userLoginInfo.password, user.hashPassword);
    if (!isCorrectPassword) {
      throw new IllegalParameterError('Authentication', 'login', 'Sorry, the password is incorrect. Please try again.');
    }

    const invalid = await this.authenticationClass.checkUserValid(user, CHECK_USER_VALID_CASE.LOGIN);
    if (invalid) {
      return {
        id: user.id,
        email: user.email,
        userStatus: user.userStatus,
        message: invalid,
      };
    }

    const token = await this.generateToken(user, jwtConfigRequest, userLoginInfo.additional?.userType);
    await this.authenticationClass.postLoginSuccess(user);
    return token;
  }

  public async sendForgotPasswordEmail(request: SendEmailForgotPasswordRequest) {
    const user = await this.authenticationClass.getUserByEmail(request.toEmail);
    if (!user) {
      throw new ConflictError('Authentication', 'login', 'User does not exist!');
    }
    // await this.authenticationClass.generateForgotPasswordCode(request);
  }

  private async checkPassword(password: string, hashPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashPassword);
  }

  public async generateHashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPassword = bcrypt.hashSync(password, salt);
    return hashPassword;
  }

  public async resendVerifyEmail(
    id: number,
    fromEmail: string,
    template: string,
    additional?: { [key: string]: any },
  ): Promise<void> {
    const user = await this.authenticationClass.getById(id);
    const error = await this.authenticationClass.checkUserValid(user, CHECK_USER_VALID_CASE.RESEND_VERIFY);
    if (error) {
      throw new ConflictError('Authentication', 'resendVerifyEmail', error);
    }

    const verifyCode = await this.authenticationClass.generateVerifyCode(user, additional);

    const sendEmailVerifyParam = new SendEmailVerifyRequest(fromEmail, user.email, template, {
      verifyCode,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      dateTimeVerifyCode: new Date(),
    });
    this.authenticationClass.sendVerifyEmail(sendEmailVerifyParam);
  }

  public async updateProfile(request: UpdateProfileRequest) {
    const user = await this.authenticationClass.getById(request.id);
    if (!user) {
      throw new IllegalParameterError('Authentication', 'updateProfile', 'User not found!');
    }
    if (request.currentPassword && request.password) {
      const isCorrectPassword = await this.checkPassword(request.currentPassword, user.hashPassword);
      if (!isCorrectPassword) {
        throw new IllegalParameterError('Authentication', 'updateProfile', 'Wrong password!');
      }

      request.hashPassword = await this.generateHashPassword(request.password);
    }
    return this.authenticationClass.updateProfile(request);
  }

  public async resetPassword(email: string, template: string, userType: string) {
    const user = await this.authenticationClass.getUserByUserName(email, userType);
    const error = await this.authenticationClass.checkUserValid(user, CHECK_USER_VALID_CASE.RESET_PASSWORD);
    if (error) {
      throw new ConflictError('Authentication', 'resendVerifyEmail', error);
    }
    await this.authenticationClass.preResetPassword(user);
    const verifyCode = await this.authenticationClass.generateForgotPasswordCode(user);
    const emailParams = new SendEmailForgotPasswordRequest('', email, template, {
      verifyCode,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      dateTimeVerifyCode: new Date(),
    });
    await this.authenticationClass.sendEmailForgotPassword(emailParams);
  }

  public async updatePassword(request: ChangePasswordRequest) {
    await this.authenticationClass.validateVerifyCode({ id: request.uid, code: request.code });
    const hashPassword = await this.generateHashPassword(request.password);
    await this.authenticationClass.updatePassword(request.uid, hashPassword);
  }

  public async verifyAccount(userId: number, code: string) {
    await this.authenticationClass.validateVerifyCode({ code, id: userId });
    return this.authenticationClass.verifyAccount(userId, code);
  }

  private async generateToken(
    user: UserReponse,
    jwtConfigRequest: JwtConfigRequest,
    userType: string,
  ): Promise<{ token: string; refreshToken: string }> {
    const tokenPayload = await this.authenticationClass.getTokenPayLoad(user);
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
  }

  public async renewToken(refreshToken: string, jwtConfigRequest: JwtConfigRequest) {
    try {
      const tokenPayload = jwt.verify(refreshToken, jwtConfigRequest.jwtRefreshKey) as {
        userName: string;
        userType: string;
      };
      const user = await this.authenticationClass.getUserByUserName(tokenPayload.userName, tokenPayload.userType);
      return this.generateToken(user, jwtConfigRequest, tokenPayload.userType);
    } catch (err) {
      throw new ForbiddenError('Authentication', 'renewToken', 'Invalid refresh token');
    }
  }
}
