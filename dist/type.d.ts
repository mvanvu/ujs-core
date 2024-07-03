export type IsValidType = 'string' | 'number' | 'boolean' | 'json' | 'object' | 'array' | 'primitive';
export interface ObjectCommonType {
    [key: string]: IsValidType | ObjectCommonType;
}
export type Primitive = null | undefined | string | number | boolean | symbol | bigint;
export type IsEqual<T1, T2> = T1 extends T2 ? ((<G>() => G extends T1 ? 1 : 2) extends <G>() => G extends T2 ? 1 : 2 ? true : false) : false;
export type IsTuple<T extends ReadonlyArray<any>> = number extends T['length'] ? false : true;
export type IsTruthy<T> = T extends boolean ? (T extends true ? true : false) : false;
export type IsFalsy<T> = T extends boolean ? (T extends false ? true : false) : false;
export type IsArray<T> = T extends any[] ? true : false;
export type IsObject<T> = T extends object ? (T extends any[] ? false : true) : false;
export type IsNumber<T> = T extends number | bigint ? true : false;
export type IsUnsignedNumber<T> = T extends number | bigint ? (`${T}` extends `-${number}` ? false : true) : false;
export type IsSignedNumber<T> = T extends number | bigint ? (`${T}` extends `-${number}` ? true : false) : false;
export type IsInt<T> = T extends number | bigint ? (`${T}` extends `${number}.${number}` ? false : true) : false;
export type IsUnsignedInt<T> = IsUnsignedNumber<T> extends true ? IsInt<T> : false;
export type IsSignedInt<T> = IsInt<T> extends true ? IsSignedNumber<T> : false;
export type IsBigInt<T> = T extends bigint ? (`${T}` extends `${number}.${number}` ? false : true) : false;
export type IsUnsignedBigInt<T> = IsUnsignedNumber<T> extends true ? IsBigInt<T> : false;
export type IsSignedBigInt<T> = IsBigInt<T> extends true ? IsSignedNumber<T> : false;
export type IsString<T> = T extends string ? true : false;
export type IsBoolean<T> = T extends boolean ? true : false;
export type IsNull<T> = T extends null ? true : false;
export type IsUndefined<T> = T extends undefined ? true : false;
export type TupleKeys<T extends ReadonlyArray<any>> = Exclude<keyof T, keyof any[]>;
export type AnyIsEqual<T1, T2> = T1 extends T2 ? (IsEqual<T1, T2> extends true ? true : never) : never;
type CombineAll<T> = T extends {
    [name in keyof T]: infer Type;
} ? Type : never;
type PropertyNameMap<T> = {
    [name in keyof T]: T[name] extends object ? SubPathsOf<name, T> | name : name;
};
type SubPathsOf<key extends keyof T, T> = `${string & key}.${string & Path<T[key]>}`;
export type Path<T> = CombineAll<PropertyNameMap<T>>;
export type PathValue<T, P extends Path<T>> = T extends any ? P extends `${infer K}.${infer R}` ? K extends keyof T ? R extends Path<T[K]> ? PathValue<T[K], R> : never : K extends number ? T extends ReadonlyArray<infer V> ? PathValue<V, R & Path<V>> : never : never : P extends keyof T ? T[P] : P extends number ? T extends ReadonlyArray<infer V> ? V : never : never : never;
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type UnionPick<T, K> = K extends keyof T ? Pick<T, K> : K extends `${infer Key}.${infer Rest}` ? Key extends keyof T ? {
    [P in Key]: Rest extends Path<T[P]> ? UnionPick<T[P], Rest> : never;
} : never : never;
export type NestedPick<T, K> = UnionToIntersection<UnionPick<T, K>>;
export type ObjectRecord = Record<PropertyKey, any>;
export type NonNeverProps<T extends object> = {
    [K in keyof T as T[K] extends never ? never : K]: T[K];
};
export type DeepPropsOmit<T, P, K> = T extends object ? K extends `${infer Key}.${infer Rest}` ? IsEqual<P, Key> extends true ? Rest extends Path<T> ? NestedOmit<T, Rest> : T : T : T : T;
export type NestedOmit<T, K> = {
    [P in Exclude<keyof T, K>]: DeepPropsOmit<T[P], P, Exclude<K, keyof T>>;
};
export type SpreadObjects<T> = UnionToIntersection<T extends Array<infer Item> ? (Item extends object ? Item : never) : never>;
export type ExtendsObject<T extends object, O extends object> = {
    [K in keyof T | keyof O]: K extends keyof T ? K extends keyof O ? T[K] extends object ? IsArray<T[K]> extends false ? O[K] extends object ? IsArray<O[K]> extends false ? ExtendsObject<T[K], O[K]> : O[K] : O[K] : O[K] : O[K] : T[K] : K extends keyof O ? O[K] : never;
};
export type MergeObjects<T extends object[]> = T extends [infer First, ...infer Rest] ? First extends object ? Rest extends object[] ? ExtendsObject<First, MergeObjects<Rest>> : never : never : {};
export type ExtendsObjects<T extends object, O extends object[]> = MergeObjects<[T, ...O]>;
export type DefaultObject<T> = IsObject<T> extends true ? T : {};
export type DefaultArray<T> = IsArray<T> extends true ? T : [];
export type DefaultValue<V, D> = V extends undefined | null ? D : V;
export type FirstElement<T extends any[]> = T extends [infer First, ...infer _] ? First : undefined;
export type LastElement<T extends any[]> = T extends [...infer _, infer Last] ? Last : undefined;
export type Callable = (...args: any[]) => any | Promise<any> | Function;
export interface EventHandler {
    name: string;
    priority: number;
    once?: boolean;
    disabled?: boolean;
    handler: Callable;
}
export interface NumberFormatOptions {
    decimals?: number;
    decimalPoint?: string;
    separator?: string;
    prefix?: string;
    suffix?: string;
    pattern?: string;
}
export type ObjectRulesOptions = {
    rules: ObjectCommonType;
    suitable?: boolean;
};
export type ArrayRulesOptions = {
    rules: IsValidType | ObjectCommonType;
    suitable?: boolean;
    notEmpty?: boolean;
};
export type ObjectArrayRulesOptions = {
    object?: ObjectRulesOptions;
    array?: ArrayRulesOptions;
};
export type ClassConstructor<T> = new (...arg: any[]) => T;
export type CreditCardType = 'VISA' | 'AMEX' | 'MASTERCARD' | 'DISCOVER' | 'DINERS' | 'JCB' | 'CHINA_UNION_PAY';
export declare class IsError extends Error {
}
export type IsArrayOption = boolean | 'unique';
export type IsArrayValue = true | 'unique';
export interface IsBaseOptions {
    isArray?: IsArrayOption;
}
export interface IsStringOptions extends IsBaseOptions {
    format?: 'email' | 'mongoId' | 'date-time' | 'ipV4' | 'creditCard' | 'url' | 'number' | 'integer' | 'unsignedNumber' | 'unsignedInteger' | 'boolean' | RegExp;
    minLength?: number;
    maxLength?: number;
    notEmpty?: boolean;
}
export interface IsNumberOptions extends IsBaseOptions {
    integer?: boolean;
    min?: number;
    max?: number;
}
export type IsPrimitiveType = 'null' | 'undefined' | 'string' | 'number' | 'boolean' | 'symbol' | 'bigint';
export interface IsPrimitiveOptions extends IsBaseOptions {
    type?: IsPrimitiveType;
}
export interface IsStrongPasswordOptions extends IsBaseOptions {
    minLength?: number;
    minSpecialChars?: number;
    minUpper?: number;
    minLower?: number;
    minNumber?: number;
}
export interface IsEnumOptions extends IsBaseOptions {
    enumArray: any[];
}
export interface IsIncludesOptions extends IsBaseOptions {
    target: any;
}
export type ReturnsIsString<O extends IsStringOptions | undefined> = O extends IsStringOptions ? O['isArray'] extends IsArrayValue ? string[] : string : string;
export type ReturnsIsNumber<O extends IsNumberOptions | undefined> = O extends IsStringOptions ? O['isArray'] extends IsArrayValue ? number[] : number : number;
export type ReturnsIsBoolean<O extends IsBaseOptions | undefined> = O extends IsStringOptions ? O['isArray'] extends IsArrayValue ? boolean[] : boolean : boolean;
export type ReturnsIsObject<O extends IsBaseOptions | undefined> = O extends IsStringOptions ? O['isArray'] extends IsArrayValue ? ObjectRecord[] : ObjectRecord : ObjectRecord;
export type IsFunc = (...agrs: any[]) => any;
export type IsAsyncFunc = (...agrs: any[]) => Promise<any>;
export type IsCallable = (...agrs: any[]) => any | Promise<any>;
export type ReturnsIsFunc<O extends IsBaseOptions | undefined> = O extends IsStringOptions ? (O['isArray'] extends IsArrayValue ? IsFunc[] : IsFunc) : IsFunc;
export type ReturnsIsAsyncFunc<O extends IsBaseOptions | undefined> = O extends IsStringOptions ? O['isArray'] extends IsArrayValue ? IsAsyncFunc[] : IsAsyncFunc : IsAsyncFunc;
export type ReturnsIsCallable<O extends IsBaseOptions | undefined> = O extends IsStringOptions ? O['isArray'] extends IsArrayValue ? IsCallable[] : IsCallable : IsCallable;
export type ReturnsIsClass<O extends IsBaseOptions | undefined> = O extends IsStringOptions ? O['isArray'] extends IsArrayValue ? ClassConstructor<any>[] : ClassConstructor<any> : ClassConstructor<any>;
export type ReturnsIsArray<O extends IsBaseOptions | undefined> = O extends IsStringOptions ? (O['isArray'] extends IsArrayValue ? any[][] : any[]) : any[];
type ReturnsIsPrimitiveType<T> = T extends 'null' ? null : T extends 'undefined' ? undefined : T extends 'string' ? string : T extends 'boolean' ? boolean : T extends 'number' ? number : T extends 'symbol' ? symbol : T extends 'bigint' ? bigint : Primitive;
export type ReturnsIsPrimitive<O extends IsPrimitiveOptions | undefined> = O extends IsStringOptions ? O['isArray'] extends IsArrayValue ? ReturnsIsPrimitiveType<O['type']>[] : ReturnsIsPrimitiveType<O['type']> : ReturnsIsPrimitiveType<O['type']>;
export {};
