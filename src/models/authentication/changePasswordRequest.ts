import { IllegalParameterError } from '../../errors/illegalParameterError';
import * as joi from 'joi';
import { CONTANTS } from './contants';

export class ChangePasswordRequest {
  public static readonly SCHEMA = joi
    .object({
      uid: joi.number().required(),
      code: joi.string().required(),
      password: joi.string().regex(CONTANTS.REGEX_PASSWORD).required(),
    })
    .required();

  public static validate(request: ChangePasswordRequest) {
    const { error } = ChangePasswordRequest.SCHEMA.validate(request);

    if (error) {
      throw new IllegalParameterError('ChangePasswordRequest', 'validate', `Invalid provided values: ${error.message}`);
    }
  }

  constructor(public readonly uid: number, public readonly code: string, public readonly password: string) {
    ChangePasswordRequest.validate(this);
  }
}
