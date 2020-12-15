import * as joi from 'joi';
export declare class UserSignupInfoRequest {
    readonly firstName: string;
    readonly lastName: string;
    readonly userName: string;
    readonly password: string;
    readonly email: string;
    readonly userNameType: string;
    id?: number | undefined;
    hashPassword?: string | undefined;
    verifyCode?: string | undefined;
    dateTimeVerifyCode?: Date | undefined;
    additional?: {
        [key: string]: any;
    } | undefined;
    static readonly SCHEMA: joi.ObjectSchema<any>;
    static validate(request: UserSignupInfoRequest): void;
    constructor(firstName: string, lastName: string, userName: string, password: string, email: string, userNameType: string, id?: number | undefined, hashPassword?: string | undefined, verifyCode?: string | undefined, dateTimeVerifyCode?: Date | undefined, additional?: {
        [key: string]: any;
    } | undefined);
}
