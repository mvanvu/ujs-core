import { ClassConstructor, CreditCardType, IsAsyncFunc, IsCallable, IsFunc, IsStringOptions, IsStrongPasswordOptions, ObjectRecord, Primitive } from '../type';
export declare class Is {
    static equals(a: any, b: any): boolean;
    static primitive(value: any): value is Primitive;
    static empty(value: any): boolean;
    static object(value: any): value is ObjectRecord;
    static json(value: any): value is ObjectRecord | any[];
    static array(value: any): value is any[];
    static arrayUnique(value: any): value is any[];
    static asyncFunc(value: any): value is IsAsyncFunc;
    static func(value: any): value is IsFunc;
    static callable(value: any): value is IsCallable;
    static number(value: any): value is number;
    static unsignedNumber(value: any): value is number;
    static integer(value: any): value is number;
    static unsignedInteger(value: any): value is number;
    static boolean(value: any): value is boolean;
    static stringFormat(value: any, format: IsStringOptions['format']): value is string;
    static string(value: any): value is string;
    static nodeJs(): boolean;
    static strongPassword(value: any, options?: IsStrongPasswordOptions): value is string;
    static elementOf(value: any, array: any[]): boolean;
    static includes(value: any, target: any): boolean;
    static class(value: any): value is ClassConstructor<any>;
    static creditCard(value: string, type?: CreditCardType): boolean;
}
