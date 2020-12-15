import * as joi from 'joi';
export declare class ChangePasswordRequest {
    readonly uid: number;
    readonly code: string;
    readonly password: string;
    static readonly SCHEMA: joi.ObjectSchema<any>;
    static validate(request: ChangePasswordRequest): void;
    constructor(uid: number, code: string, password: string);
}
