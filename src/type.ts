export type CommonType =
   | 'string'
   | 'number'
   | 'snumber'
   | 'unumber'
   | 'int'
   | 'sint'
   | 'uint'
   | 'bigint'
   | 'sbigint'
   | 'ubigint'
   | 'object'
   | 'array'
   | 'boolean'
   | 'undefined'
   | 'symbol'
   | 'function'
   | 'null'
   | 'regex'
   | 'set'
   | 'map'
   | 'NaN'
   | 'datestring'
   | 'date'
   | 'datetime'
   | 'primitive';

export interface ObjectCommonType {
   [key: string]: CommonType | ObjectCommonType;
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

type CombineAll<T> = T extends { [name in keyof T]: infer Type } ? Type : never;

type PropertyNameMap<T> = {
   [name in keyof T]: T[name] extends object ? SubPathsOf<name, T> | name : name;
};

type SubPathsOf<key extends keyof T, T> = `${string & key}.${string & Path<T[key]>}`;

export type Path<T> = CombineAll<PropertyNameMap<T>>;

export type PathValue<T, P extends Path<T>> = T extends any
   ? P extends `${infer K}.${infer R}`
      ? K extends keyof T
         ? R extends Path<T[K]>
            ? PathValue<T[K], R>
            : never
         : K extends number
           ? T extends ReadonlyArray<infer V>
              ? PathValue<V, R & Path<V>>
              : never
           : never
      : P extends keyof T
        ? T[P]
        : P extends number
          ? T extends ReadonlyArray<infer V>
             ? V
             : never
          : never
   : never;

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type UnionPick<T, K extends Path<T>> = K extends keyof T
   ? Pick<T, K>
   : K extends `${infer Key}.${infer Rest}`
     ? Key extends keyof T
        ? { [P in Key]: Rest extends Path<T[P]> ? UnionPick<T[P], Rest> : never }
        : never
     : never;

export type NestedPick<T extends object, K extends Path<T>> = UnionToIntersection<UnionPick<T, K>>;

export type ObjectRecord = Record<PropertyKey, any>;

export type NonNeverProps<T extends object> = { [K in keyof T as T[K] extends never ? never : K]: T[K] };

export type DeepPropsOmit<T, P, K> = T extends object
   ? K extends `${infer Key}.${infer Rest}`
      ? IsEqual<P, Key> extends true
         ? Rest extends Path<T>
            ? NestedOmit<T, Rest>
            : T
         : T
      : T
   : T;

export type NestedOmit<T extends object, K extends Path<T>> = {
   [P in Exclude<keyof T, K>]: DeepPropsOmit<T[P], P, Exclude<K, keyof T>>;
};

export type SpreadObjects<T> = UnionToIntersection<T extends Array<infer Item> ? (Item extends object ? Item : never) : never>;

export type ExtendsObject<T extends object, O extends object> = {
   [K in keyof T | keyof O]: K extends keyof T
      ? K extends keyof O
         ? T[K] extends object
            ? IsArray<T[K]> extends false
               ? O[K] extends object
                  ? IsArray<O[K]> extends false
                     ? ExtendsObject<T[K], O[K]>
                     : O[K]
                  : O[K]
               : O[K]
            : O[K]
         : T[K]
      : K extends keyof O
        ? O[K]
        : never;
};

export type MergeObjects<T extends object[]> = T extends [infer First, ...infer Rest]
   ? First extends object
      ? Rest extends object[]
         ? ExtendsObject<First, MergeObjects<Rest>>
         : never
      : never
   : {};

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
   decimalPoint?: string; // Defaults to dot (.)
   separator?: string; // Defaults to comma (,)
   prefix?: string;
   suffix?: string;
   pattern?: string;
}

export type ObjectRulesOptions = { rules: ObjectCommonType; suitable?: boolean };

export type ArrayRulesOptions = { rules: CommonType | ObjectCommonType; suitable?: boolean; notEmpty?: boolean };

export type ObjectArrayRulesOptions = {
   object?: ObjectRulesOptions; // For type Is.object only
   array?: ArrayRulesOptions; // For type Is.array only
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
   allowArray?: boolean | { root?: boolean; deep?: boolean };
};

export type IsValidOptions<T> = {
   type: T;
   each?: boolean;
   meta?: IsEqual<T, 'object'> extends true
      ? ObjectRulesOptions
      : IsEqual<T, 'array'> extends true
        ? ArrayRulesOptions
        : IsEqual<T, 'objectOrArray'> extends true
          ? ObjectArrayRulesOptions
          : IsEqual<T, 'equals'> extends true
            ? EqualsRulesOptions
            : IsEqual<T, 'flatObject'> extends true
              ? FlatObjectRulesOptions
              : IsEqual<T, 'strongPassword'> extends true
                ? StrongPasswordOptions
                : T extends 'inArray'
                  ? any[]
                  : IsEqual<T, 'includes'> extends true
                    ? any
                    : IsEqual<T, 'creditCard'> extends true
                      ? CreditCardType
                      : IsEqual<T, 'matched'> extends true
                        ? RegExp
                        : T extends 'min' | 'max'
                          ? number
                          : never;
};

export type CreditCardType = 'VISA' | 'AMEX' | 'MASTERCARD' | 'DISCOVER' | 'DINERS' | 'JCB' | 'CHINA_UNION_PAY';
export class IsError extends Error {}
export type ReturnIsString<Each> = Each extends true ? string[] : string;
export type ReturnIsNumber<Each> = Each extends true ? number[] : number;
export type ReturnIsBigInt<Each> = Each extends true ? bigint[] : bigint;
export type ReturnIsNull<Each> = Each extends true ? null[] : null;
export type ReturnIsUndefined<Each> = Each extends true ? undefined[] : undefined;
export type ReturnIsSymbol<Each> = Each extends true ? symbol[] : symbol;
export type ReturnIsPrimitive<Each, TPrimitive = unknown> = TPrimitive extends unknown
   ? Each extends true
      ? Primitive[]
      : Primitive
   : TPrimitive extends string
     ? ReturnIsString<Each>
     : TPrimitive extends number
       ? ReturnIsNumber<Each>
       : TPrimitive extends bigint
         ? ReturnIsBigInt<Each>
         : TPrimitive extends null
           ? ReturnIsNull<Each>
           : TPrimitive extends undefined
             ? ReturnIsUndefined<Each>
             : TPrimitive extends symbol
               ? ReturnIsSymbol<Each>
               : false;
export type PromiseLike = Promise<any> | ((...args: any[]) => Promise<any>);
export type ClassConstructor<T> = new (...arg: any[]) => T;
