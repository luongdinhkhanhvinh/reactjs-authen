import * as joi from 'joi';
export declare class UpdateProfileRequest {
    readonly id: number;
    readonly firstName: string;
    readonly lastName: string;
    readonly profileImageId: number;
    readonly currentPassword: string;
    readonly password: string;
    hashPassword?: string | undefined;
    additional?: {
        [key: string]: any;
    } | undefined;
    static readonly SCHEMA: joi.ObjectSchema<any>;
    static validate(request: UpdateProfileRequest): void;
    constructor(id: number, firstName: string, lastName: string, profileImageId: number, currentPassword: string, password: string, hashPassword?: string | undefined, additional?: {
        [key: string]: any;
    } | undefined);
}
