import * as joi from 'joi';
export declare class UserLoginRequest {
    readonly userName: string;
    readonly userNameType: string;
    readonly password: string;
    additional?: {
        [key: string]: any;
    } | undefined;
    static readonly SCHEMA: joi.ObjectSchema<any>;
    static validate(request: UserLoginRequest): void;
    constructor(userName: string, userNameType: string, password: string, additional?: {
        [key: string]: any;
    } | undefined);
}
