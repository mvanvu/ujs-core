import { DateTime } from './datetime';
import { CommonType, IsEqual, ObjectCommonType, ObjectRecord, Primitive } from '../type';
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
export type IsValidType<T = keyof typeof Is> = T extends 'typeOf' | 'prototype' | 'nodeJs' | 'valid' | 'each' ? never : T;
export type IsValidOptions<T> = {
    type: T;
    each?: boolean;
    meta?: IsEqual<T, 'object'> extends true ? ObjectRulesOptions : IsEqual<T, 'array'> extends true ? ArrayRulesOptions : IsEqual<T, 'objectOrArray'> extends true ? ObjectArrayRulesOptions : IsEqual<T, 'equals'> extends true ? EqualsRulesOptions : IsEqual<T, 'flatObject'> extends true ? FlatObjectRulesOptions : IsEqual<T, 'strongPassword'> extends true ? StrongPasswordOptions : T extends 'inArray' ? any[] : IsEqual<T, 'includes'> extends true ? any : IsEqual<T, 'creditCard'> extends true ? CreditCardType : undefined;
};
export type CreditCardType = 'VISA' | 'AMEX' | 'MASTERCARD' | 'DISCOVER' | 'DINERS' | 'JCB' | 'CHINA_UNION_PAY';
export declare class IsError extends Error {
}
type ReturnIsString<Each> = Each extends true ? string[] : string;
type ReturnIsNumber<Each> = Each extends true ? number[] : number;
type ReturnIsBigInt<Each> = Each extends true ? bigint[] : bigint;
type ReturnIsNull<Each> = Each extends true ? null[] : null;
type ReturnIsUndefined<Each> = Each extends true ? undefined[] : undefined;
type ReturnIsSymbol<Each> = Each extends true ? symbol[] : symbol;
type ReturnIsPrimitive<Each, TPrimitive = unknown> = TPrimitive extends unknown ? Each extends true ? Primitive[] : Primitive : TPrimitive extends string ? ReturnIsString<Each> : TPrimitive extends number ? ReturnIsNumber<Each> : TPrimitive extends bigint ? ReturnIsBigInt<Each> : TPrimitive extends null ? ReturnIsNull<Each> : TPrimitive extends undefined ? ReturnIsUndefined<Each> : TPrimitive extends symbol ? ReturnIsSymbol<Each> : false;
export declare class Is {
    static typeOf(value: any, type: CommonType, each?: boolean): boolean;
    static equals(a: any, b: any): boolean;
    static emptyObject<E extends boolean = false, R = E extends true ? {}[] : {}>(value: any, each?: E): value is R;
    static date<E extends boolean = false, R = E extends true ? Date[] : Date>(value: any, each?: E): value is R;
    static datetime<E extends boolean = false, R = E extends true ? DateTime[] : DateTime>(value: any, each?: boolean): value is R;
    static dateString<E extends boolean = false>(d: any, each?: E): d is ReturnIsString<E>;
    static primitive<E extends boolean = false>(value: any, each?: E): value is ReturnIsPrimitive<E>;
    static empty(value: any, each?: boolean): boolean;
    static nothing(value: any, each?: boolean): value is (null | undefined | typeof NaN)[];
    static object(value: any, options?: ObjectRulesOptions): value is ObjectRecord;
    static flatObject(value: any, allowArray?: FlatObjectRulesOptions['allowArray']): value is ObjectRecord;
    static objectOrArray(value: any): value is ObjectRecord | any[];
    static array(value: any, options?: ArrayRulesOptions): value is any[];
    static asyncFunc(value: any, each?: boolean): boolean;
    static func(value: any, each?: boolean): boolean;
    static callable(value: any, each?: boolean): boolean;
    static number<E extends boolean = false>(value: any, each?: E): value is ReturnIsNumber<E>;
    static sNumber<E extends boolean = false>(value: any, each?: boolean): value is ReturnIsNumber<E>;
    static uNumber<E extends boolean = false>(value: any, each?: boolean): value is ReturnIsNumber<E>;
    static int<E extends boolean = false>(value: any, each?: boolean): value is ReturnIsNumber<E>;
    static sInt<E extends boolean = false>(value: any, each?: boolean): value is ReturnIsNumber<E>;
    static uInt<E extends boolean = false>(value: any, each?: boolean): value is ReturnIsNumber<E>;
    static bigInt<E extends boolean = false>(value: any, each?: E): value is ReturnIsBigInt<E>;
    static sBigInt<E extends boolean = false>(value: any, each?: E): value is ReturnIsBigInt<E>;
    static uBigInt<E extends boolean = false>(value: any, each?: E): value is ReturnIsBigInt<E>;
    static boolean<E extends boolean = false, R = E extends true ? boolean[] : boolean>(value: any, each?: E): value is R;
    static string<E extends boolean = false>(value: any, each?: E): value is ReturnIsString<E>;
    static null<E extends boolean = false, R = E extends true ? null[] : null>(value: any, each?: E): value is R;
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
    static email<E extends boolean = false>(value: any, each?: E): value is ReturnIsString<E>;
    static inArray(value: any, array: any[], each?: boolean): boolean;
    static includes(value: any, target: any, each?: boolean): boolean;
    static class(value: any, each?: boolean): boolean;
    static each(each: boolean, value: any, callback: (item: any) => boolean): boolean;
    static arrayUnique(value: any, each?: boolean): value is any[];
    static mongoId<E extends boolean = false>(value: any, each?: E): value is ReturnIsString<E>;
    static creditCard(value: any, type?: CreditCardType, each?: boolean): boolean;
    static valid<T extends IsValidType>(value: any, options: IsValidOptions<T>): boolean;
}
export {};
