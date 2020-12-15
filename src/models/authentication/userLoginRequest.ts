import { IllegalParameterError } from '../../errors/illegalParameterError';
import * as joi from 'joi';

export class UserLoginRequest {
  public static readonly SCHEMA = joi
    .object({
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
      userNameType: joi.string().valid('phone', 'email', 'string').required(),
      password: joi.string().required(),
      additional: joi.object().optional(),
    })
    .required();

  public static validate(request: UserLoginRequest) {
    const { error } = UserLoginRequest.SCHEMA.validate(request);

    if (error) {
      throw new IllegalParameterError(
        'SendEmailVerifyRequest',
        'validate',
        `Invalid provided values: ${error.message}`,
      );
    }
  }

  constructor(
    public readonly userName: string,
    public readonly userNameType: string,
    public readonly password: string,
    public additional?: { [key: string]: any },
  ) {
    UserLoginRequest.validate(this);
  }
}
