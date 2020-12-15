import { IllegalParameterError } from '../../errors/illegalParameterError';
import * as joi from 'joi';

export class SendEmailVerifyRequest {
  public static readonly SCHEMA = joi
    .object({
      fromEmail: joi.string().email().optional().allow('', null),
      toEmail: joi.string().email().optional().allow('', null),
      htmlTemplate: joi.string().optional().allow('', null),
      param: joi
        .object({
          id: joi.number().optional(),
          firstName: joi.string().optional(),
          lastName: joi.string().optional(),
          verifyCode: joi.string().optional(),
          dateTimeVerifyCode: joi.date().optional(),
        })
        .optional(),
    })
    .required();

  public static validate(request: SendEmailVerifyRequest) {
    const { error } = SendEmailVerifyRequest.SCHEMA.validate(request);

    if (error) {
      throw new IllegalParameterError(
        'SendEmailVerifyRequest',
        'validate',
        `Invalid provided values: ${error.message}`,
      );
    }
  }

  constructor(
    public readonly fromEmail: string,
    public readonly toEmail: string,
    public readonly htmlTemplate: string,
    public param: { id: number; firstName: string; lastName: string; verifyCode: string; dateTimeVerifyCode: Date },
  ) {
    SendEmailVerifyRequest.validate(this);
  }
}
