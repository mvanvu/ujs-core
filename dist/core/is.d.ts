import { DateTime } from './datetime';
import { CommonType, ObjectCommonType } from '../type';
type RulesOptions = {
    rules: ObjectCommonType;
    suitable?: boolean;
};
export declare class Is {
    static typeOf(value: any, type: CommonType, each?: boolean): boolean;
    static equals(a: any, b: any): boolean;
    static emptyObject(obj: any): boolean;
    static date(d: any): DateTime | false;
    static flatValue(value: any): boolean;
    static empty(value: any): boolean;
    static nothing(value: any): boolean;
    static object(value: any, path?: string): boolean;
    static flatObject(value: any, allowArray?: boolean | {
        root?: boolean;
        deep?: boolean;
    }): boolean;
    static objectOrArray(value: any): boolean;
    private static validateObject;
    static suitableObject(value: any, options?: RulesOptions): boolean;
    static array(value: any, options?: {
        rules: CommonType | ObjectCommonType;
        suitable?: boolean;
        notEmpty?: boolean;
    }): boolean;
    static asyncFunc(value: any): boolean;
    static func(value: any, each?: boolean): boolean;
    static callable(value: any): boolean;
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
    static nullOrUndefined(value: any): boolean;
    static strongPassword(value: string, options?: {
        minLength?: number;
        noSpaces?: boolean;
    }): boolean;
}
export {};
