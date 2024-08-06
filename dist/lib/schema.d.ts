import { EnumElement, IsBaseOptions, IsNumberOptions, IsStringOptionFormat, IsStringOptions, IsStrongPasswordOptions } from '../type';
export declare abstract class BaseSchema {
    protected options: IsBaseOptions;
    private readonly isType;
    constructor();
    get isAllowNull(): boolean;
    isArray(isArray?: boolean | 'unique'): this;
    optional(optional?: boolean): this;
    nullable(nullable?: boolean): this;
    check(value: any): boolean;
    abstract buildSchema(): Record<string, any>;
}
export declare class StringSchema extends BaseSchema {
    protected options: IsStringOptions;
    constructor(options?: IsStringOptions);
    minLength(num: number): this;
    maxLength(num: number): this;
    format(format: IsStringOptionFormat): this;
    strongPassword(options?: Omit<IsStrongPasswordOptions, 'isArray' | 'optional' | 'nullable'>): this;
    buildSchema(): {
        type: string | string[];
        minLength: number;
        maxLength: number;
        format: string;
    };
}
export declare class NumberSchema extends BaseSchema {
    protected options: IsNumberOptions;
    constructor(options?: IsNumberOptions);
    integer(integer?: boolean): this;
    min(min: number): this;
    max(max: number): this;
    buildSchema(): {
        type: string | string[];
        minimum: number;
        maximum: number;
    };
}
export declare class BooleanSchema extends BaseSchema {
    protected options: IsBaseOptions;
    constructor(options?: IsBaseOptions);
    buildSchema(): {
        type: string | string[];
    };
}
export type ItemSchema = NumberSchema | StringSchema | BooleanSchema | ObjectSchema<any> | ArraySchema<any>;
export type ObjectSchemaProps<T extends object> = {
    [K in keyof T]: T[K] extends object ? ObjectSchemaProps<T[K]> : ItemSchema;
};
export declare class ObjectSchema<T extends object> extends BaseSchema {
    private properties?;
    private _isWhiteList;
    constructor(properties?: ObjectSchemaProps<T>);
    get isWhiteList(): boolean;
    get keys(): string[];
    each(callback: (property: ItemSchema, k: string) => any): void;
    whiteList(isWhiteList?: boolean): this;
    check(value: any): boolean;
    buildSchema(): {
        type: string | string[];
        required: string[];
        properties: {};
    };
}
export declare class ArraySchema<T extends ItemSchema | ItemSchema[]> extends BaseSchema {
    private itemsProps?;
    constructor(itemsProps?: T);
    check(value: any): boolean;
    buildSchema(): {
        type: string | string[];
        prefixItems: any[];
        items: {};
    };
}
export declare class EnumSchema extends BaseSchema {
    private emum?;
    constructor(emum?: EnumElement[]);
    valid(enumArray: EnumElement[]): this;
    check(value: any): boolean;
    buildSchema(): {
        type: string[];
        enum: EnumElement[];
    };
}
export declare class Schema {
    static string(options?: IsStringOptions): StringSchema;
    static number(options?: IsNumberOptions): NumberSchema;
    static boolean(options?: IsBaseOptions): BooleanSchema;
    static enum(emum: EnumElement[]): EnumSchema;
    static object<T extends object>(properties?: ObjectSchemaProps<T>): ObjectSchema<T>;
    static array<T extends ItemSchema | ItemSchema[]>(itemsProps?: T): ArraySchema<T>;
}
