import { IllegalParameterError } from '../../errors/illegalParameterError';
import * as joi from 'joi';
import { CONTANTS } from './contants';

export class UpdateProfileRequest {
  public static readonly SCHEMA = joi
    .object({
      id: joi.number().required(),
      email: joi.string().email().optional(),
      firstName: joi.string().optional(),
      lastName: joi.string().optional(),
      profileImageId: joi.number().optional().allow(null),
      currentPassword: joi.string().regex(CONTANTS.REGEX_PASSWORD).optional(),
      password: joi.string().regex(CONTANTS.REGEX_PASSWORD).optional(),
      hashPassword: joi.string().optional(),
      additional: joi.object().optional(),
    })
    .required();

  public static validate(request: UpdateProfileRequest) {
    const { error } = UpdateProfileRequest.SCHEMA.validate(request);

    if (error) {
      throw new IllegalParameterError('UpdateProfileRequest', 'validate', `Invalid provided values: ${error.message}`);
    }
  }

  constructor(
    public readonly id: number,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly profileImageId: number,
    public readonly currentPassword: string,
    public readonly password: string,
    public hashPassword?: string,
    public additional?: { [key: string]: any },
  ) {
    UpdateProfileRequest.validate(this);
  }
}
