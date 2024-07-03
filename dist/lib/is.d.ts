import { CreditCardType, IsBaseOptions, IsEnumOptions, IsIncludesOptions, IsNumberOptions, IsPrimitiveOptions, IsStringOptions, IsStrongPasswordOptions, ReturnsIsArray, ReturnsIsAsyncFunc, ReturnsIsBoolean, ReturnsIsCallable, ReturnsIsClass, ReturnsIsFunc, ReturnsIsNumber, ReturnsIsObject, ReturnsIsPrimitive, ReturnsIsString } from '../type';
export declare class Is {
    static equals(a: any, b: any): boolean;
    static primitive<O extends IsPrimitiveOptions>(value: any, options?: O): value is ReturnsIsPrimitive<O>;
    static empty(value: any, options?: IsBaseOptions): boolean;
    static object<O extends IsBaseOptions>(value: any, options?: O): value is ReturnsIsObject<O>;
    static json<O extends IsBaseOptions>(value: any, options?: O): value is ReturnsIsObject<O>;
    static array<O extends IsBaseOptions>(value: any, options?: O): value is ReturnsIsArray<O>;
    static asyncFunc<O extends IsBaseOptions>(value: any, options?: O): value is ReturnsIsAsyncFunc<O>;
    static func<O extends IsBaseOptions>(value: any, options?: O): value is ReturnsIsFunc<O>;
    static callable<O extends IsBaseOptions>(value: any, options?: O): value is ReturnsIsCallable<O>;
    static number<O extends IsNumberOptions>(value: any, options?: O): value is ReturnsIsNumber<O>;
    static boolean<O extends IsBaseOptions>(value: any, options?: IsBaseOptions): value is ReturnsIsBoolean<O>;
    static string<O extends IsStringOptions>(value: any, options?: O): value is ReturnsIsString<O>;
    static nodeJs(): boolean;
    static strongPassword<O extends IsStrongPasswordOptions>(value: any, options?: O): value is ReturnsIsString<O>;
    static enum(value: any, options: IsEnumOptions): boolean;
    static includes(value: any, options: IsIncludesOptions): boolean;
    static class<O extends IsBaseOptions>(value: any, options?: O): value is ReturnsIsClass<O>;
    private static each;
    static creditCard(value: string, type?: CreditCardType): boolean;
}
