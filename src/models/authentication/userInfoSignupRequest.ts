import { IllegalParameterError } from '../../errors/illegalParameterError';
import * as joi from 'joi';
import { CONTANTS } from './contants';

export class UserSignupInfoRequest {
  public static readonly SCHEMA = joi
    .object({
      id: joi.number().optional(),
      firstName: joi.string().required(),
      lastName: joi.string().required(),
      userNameType: joi.string().valid('phone', 'email', 'string').required(),
      password: joi.string().regex(CONTANTS.REGEX_PASSWORD).required(),
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

  public static validate(request: UserSignupInfoRequest) {
    const { error } = UserSignupInfoRequest.SCHEMA.validate(request);

    if (error) {
      throw new IllegalParameterError('UserSignupInfo', 'validate', `Invalid provided values: ${error.message}`);
    }
  }

  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly userName: string,
    public readonly password: string,
    public readonly email: string,
    public readonly userNameType: string,
    public id?: number,
    public hashPassword?: string,
    public verifyCode?: string,
    public dateTimeVerifyCode?: Date,
    public additional?: { [key: string]: any },
  ) {
    UserSignupInfoRequest.validate(this);
  }
}
