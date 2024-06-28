import { DateTime } from './datetime';
import { ArrayRulesOptions, ClassConstructor, CreditCardType, FlatObjectRulesOptions, IsValidOptions, IsValidType, ObjectRecord, ObjectRulesOptions, ReturnIsBigInt, ReturnIsNull, ReturnIsNumber, ReturnIsPrimitive, ReturnIsPromise, ReturnIsString, ReturnIsSymbol, ReturnIsUndefined, StrongPasswordOptions } from '../type';
export declare class Is {
    static equals(a: any, b: any): boolean;
    static emptyObject<E extends boolean = false, R = E extends true ? {}[] : {}>(value: any, each?: E): value is R;
    static date<E extends boolean = false, R = E extends true ? Date[] : Date>(value: any, each?: E): value is R;
    static datetime<E extends boolean = false, R = E extends true ? DateTime[] : DateTime>(value: any, each?: boolean): value is R;
    static dateString<E extends boolean = false>(value: any, each?: E): value is ReturnIsString<E>;
    static primitive<E extends boolean = false>(value: any, each?: E): value is ReturnIsPrimitive<E>;
    static empty(value: any, each?: boolean): boolean;
    static nothing(value: any, each?: boolean): value is (null | undefined | typeof NaN)[];
    static object(value: any, options?: ObjectRulesOptions): value is ObjectRecord;
    static flatObject(value: any, allowArray?: FlatObjectRulesOptions['allowArray']): value is ObjectRecord;
    static objectOrArray(value: any): value is ObjectRecord | any[];
    static array(value: any, options?: ArrayRulesOptions): value is any[];
    static asyncFunc<E extends boolean = false>(value: any, each?: E): value is ReturnIsPromise<E>;
    static func<E extends boolean = false, R = E extends true ? Function[] : Function>(value: any, each?: E): value is R;
    static callable<E extends boolean = false, R = E extends true ? Array<Function & PromiseLike<any>> : Function & PromiseLike<any>>(value: any, each?: E): value is R;
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
    static null<E extends boolean = false>(value: any, each?: E): value is ReturnIsNull<E>;
    static undefined<E extends boolean = false>(value: any, each?: E): value is ReturnIsUndefined<E>;
    static nan<E extends boolean = false, R = E extends true ? (typeof NaN)[] : typeof NaN>(value: any, each?: E): value is R;
    static symbol<E extends boolean = false>(value: any, each?: E): value is ReturnIsSymbol<E>;
    static map<E extends boolean = false, R = E extends true ? Map<any, any>[] : Map<any, any>>(value: any, each?: E): value is R;
    static set<E extends boolean = false, R = E extends true ? Set<any>[] : Set<any>>(value: any, each?: E): value is R;
    static regex<E extends boolean = false, R = E extends true ? RegExp[] : RegExp>(value: any, each?: E): value is R;
    static nodeJs(): boolean;
    static nullOrUndefined<E extends boolean = false>(value: any, each?: E): value is ReturnIsNull<E> | ReturnIsUndefined<E>;
    static strongPassword<E extends boolean = false>(value: any, options?: StrongPasswordOptions, each?: E): value is ReturnIsString<E>;
    static promise<E extends boolean = false>(value: any, each?: E): value is ReturnIsPromise<E>;
    static email<E extends boolean = false>(value: any, each?: E): value is ReturnIsString<E>;
    static inArray(value: any, array: any[], each?: boolean): boolean;
    static includes(value: any, target: any, each?: boolean): boolean;
    static class<E extends boolean = false, R = E extends true ? ClassConstructor<any>[] : ClassConstructor<any>>(value: any, each?: boolean): value is R;
    static each(each: boolean, value: any, callback: (item: any) => boolean): boolean;
    static arrayUnique(value: any, each?: boolean): value is any[];
    static mongoId<E extends boolean = false>(value: any, each?: E): value is ReturnIsString<E>;
    static matched<E extends boolean = false>(value: any, regex: RegExp, each?: E): value is ReturnIsString<E>;
    static creditCard(value: any, type?: CreditCardType, each?: boolean): boolean;
    static min<E extends boolean = false>(value: any, number: number, each?: E): value is ReturnIsNumber<E>;
    static max<E extends boolean = false>(value: any, number: number, each?: E): value is ReturnIsNumber<E>;
    static minLength<E extends boolean = false>(value: any, number: number, each?: E): value is ReturnIsString<E>;
    static maxLength<E extends boolean = false>(value: any, number: number, each?: E): value is ReturnIsString<E>;
    static trim<E extends boolean = false>(value: any, each?: E): value is ReturnIsString<E>;
    static ipV4<E extends boolean = false>(value: any, each?: E): value is ReturnIsString<E>;
    static url<E extends boolean = false>(value: any, each?: E): value is ReturnIsString<E>;
    static addRule(rule: string, handler: (value: any) => boolean): void;
    static valid<T extends IsValidType>(value: any, options: IsValidOptions<T>): boolean;
}
