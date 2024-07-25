import { IsBaseOptions, IsNumberOptions, IsStringOptionFormat, IsStringOptions } from '../type';
export declare class BaseSchema {
    protected options: IsBaseOptions;
    protected errors?: Record<string, string>;
    private readonly isType;
    constructor();
    isArray(isArray?: boolean | 'unique'): this;
    optional(optional?: boolean): this;
    nullable(nullable?: boolean): this;
    check(value: any): boolean;
}
export declare class StringSchema extends BaseSchema {
    protected options: IsStringOptions;
    minLength(num: number): this;
    maxLength(num: number): this;
    notEmpty(notEmpty?: boolean): this;
    format(format: IsStringOptionFormat): this;
}
export declare class NumberSchema extends BaseSchema {
    protected options: IsNumberOptions;
    integer(integer?: boolean): this;
    min(min: number): this;
    max(max: number): this;
}
export declare class BooleanSchema extends BaseSchema {
}
type ItemSchema = NumberSchema | ArraySchema | StringSchema | BooleanSchema | ObjectSchema;
export declare class ObjectSchema extends BaseSchema {
    private _isWhiteList;
    private properties;
    get isWhiteList(): boolean;
    get keys(): string[];
    each(callback: (property: ItemSchema, k: string) => any): void;
    props(props: Record<string, ItemSchema>): this;
    whiteList(isWhiteList?: boolean): this;
    check(value: any): boolean;
}
export declare class ArraySchema extends BaseSchema {
    private itemsProps;
    items(itemsProps: ItemSchema | ItemSchema[]): this;
    check(value: any): boolean;
}
export declare class Schema {
    static string(): StringSchema;
    static number(): NumberSchema;
    static boolean(): BooleanSchema;
    static object(): ObjectSchema;
    static array(): ArraySchema;
}
export {};
