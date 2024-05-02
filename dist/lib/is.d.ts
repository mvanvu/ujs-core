import { CommonType, IsEqual, ObjectCommonType } from '../type';
export type ObjectRulesOptions = {
    rules: ObjectCommonType;
    suitable?: boolean;
};
export type ArrayRulesOptions = {
    rules: CommonType | ObjectCommonType;
    suitable?: boolean;
    notEmpty?: boolean;
};
export type ObjectArrayRulesOptions = {
    object?: ObjectRulesOptions;
    array?: ArrayRulesOptions;
};
export type EqualsRulesOptions = {
    equalsTo: any;
};
export type StrongPasswordOptions = {
    minLength?: number;
    noSpaces?: boolean;
    minSpecialChars?: number;
    minUpper?: number;
    minLower?: number;
    minNumber?: number;
};
export type FlatObjectRulesOptions = {
    allowArray?: boolean | {
        root?: boolean;
        deep?: boolean;
    };
};
export type IsValidType<T = keyof typeof Is> = T extends 'typeOf' | 'prototype' | 'flatValue' | 'nodeJs' | 'valid' ? never : T;
export type IsValidOptions<T> = {
    type: T;
    each?: boolean;
    meta?: IsEqual<T, 'object'> extends true ? ObjectRulesOptions : IsEqual<T, 'array'> extends true ? ArrayRulesOptions : IsEqual<T, 'objectOrArray'> extends true ? ObjectArrayRulesOptions : IsEqual<T, 'equals'> extends true ? EqualsRulesOptions : IsEqual<T, 'flatObject'> extends true ? FlatObjectRulesOptions : IsEqual<T, 'strongPassword'> extends true ? StrongPasswordOptions : IsEqual<T, 'inArray'> extends true ? any[] : undefined;
};
export declare class IsError extends Error {
}
export declare class Is {
    static typeOf(value: any, type: CommonType, each?: boolean): boolean;
    static equals(a: any, b: any): boolean;
    static emptyObject(obj: any, each?: boolean): boolean;
    static date(d: any, each?: boolean): boolean;
    static datetime(d: any, each?: boolean): boolean;
    static dateString(d: any, each?: boolean): boolean;
    static flatValue(value: any, each?: boolean): boolean;
    static primitive(value: any, each?: boolean): boolean;
    static empty(value: any, each?: boolean): boolean;
    static nothing(value: any, each?: boolean): boolean;
    static object(value: any, options?: ObjectRulesOptions): boolean;
    static flatObject(value: any, allowArray?: FlatObjectRulesOptions['allowArray']): boolean;
    static objectOrArray<T>(value: T): boolean;
    static array(value: any, options?: ArrayRulesOptions): boolean;
    static asyncFunc(value: any, each?: boolean): boolean;
    static func(value: any, each?: boolean): boolean;
    static callable(value: any, each?: boolean): boolean;
    static number(value: any, each?: boolean): boolean;
    static sNumber(value: any, each?: boolean): boolean;
    static uNumber(value: any, each?: boolean): boolean;
    static int(value: any, each?: boolean): boolean;
    static sInt(value: any, each?: boolean): boolean;
    static uInt(value: any, each?: boolean): boolean;
    static bigInt(value: any, each?: boolean): boolean;
    static sBigInt(value: any, each?: boolean): boolean;
    static uBigInt(value: any, each?: boolean): boolean;
    static boolean(value: any, each?: boolean): boolean;
    static string(value: any, each?: boolean): boolean;
    static null(value: any, each?: boolean): boolean;
    static undefined(value: any, each?: boolean): boolean;
    static nan(value: any, each?: boolean): boolean;
    static symbol(value: any, each?: boolean): boolean;
    static map(value: any, each?: boolean): boolean;
    static set(value: any, each?: boolean): boolean;
    static regex(value: any, each?: boolean): boolean;
    static nodeJs(): boolean;
    static nullOrUndefined(value: any, each?: boolean): boolean;
    static strongPassword(value: any, options?: StrongPasswordOptions, each?: boolean): boolean;
    static promise(value: any, each?: boolean): boolean;
    static email(value: any, each?: boolean): boolean;
    static inArray(value: any, array: any[], each?: boolean): boolean;
    static valid<T extends IsValidType>(value: any, options: IsValidOptions<T>): boolean;
}
