import * as joi from 'joi';
export declare class SendEmailVerifyRequest {
    readonly fromEmail: string;
    readonly toEmail: string;
    readonly htmlTemplate: string;
    param: {
        id: number;
        firstName: string;
        lastName: string;
        verifyCode: string;
        dateTimeVerifyCode: Date;
    };
    static readonly SCHEMA: joi.ObjectSchema<any>;
    static validate(request: SendEmailVerifyRequest): void;
    constructor(fromEmail: string, toEmail: string, htmlTemplate: string, param: {
        id: number;
        firstName: string;
        lastName: string;
        verifyCode: string;
        dateTimeVerifyCode: Date;
    });
}
