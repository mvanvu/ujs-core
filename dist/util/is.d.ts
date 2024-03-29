import { DateTime } from './datetime';
import { CommonType, ObjectCommonType } from '../type';
type RulesOptions = {
    rules: ObjectCommonType;
    suitable?: boolean;
};
export declare class Is {
    static emptyObject(obj: any): boolean;
    static date(d: any): DateTime | false;
    static asyncFunc(fn: any): boolean;
    static typeOf(value: any, type: CommonType, each?: boolean): boolean;
    static equals(a: any, b: any): boolean;
    static flatValue(value: any): boolean;
    static empty(value: any): boolean;
    static nothing(value: any): boolean;
    static object(value: any): boolean;
    static validateObject(value: any, options?: RulesOptions): void;
    static record(value: any, options?: RulesOptions): boolean;
    static array(value: any, options?: {
        rules: CommonType | ObjectCommonType;
        suitable?: boolean;
        notEmpty?: boolean;
    }): boolean;
}
export {};
