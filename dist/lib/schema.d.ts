import { EnumElement, IsArrayOptions, IsBaseOptions, IsNumberOptions, IsStringOptionFormat, IsStringOptions, IsStrongPasswordOptions } from '../type';
export declare const schemaErrors: {
    NOT_AN_ARRAY: string;
    NOT_AN_OBJECT: string;
    NOT_A_STRING: string;
    INVALID_STRING_FORMAT: string;
    STRING_MIN_LENGTH: string;
    STRING_MAX_LENGTH: string;
    ARRAY_MIN_LENGTH: string;
    ARRAY_MAX_LENGTH: string;
    NOT_A_NUMBER: string;
    NOT_AN_INTEGER: string;
    NUMBER_MINIMUM: string;
    NUMBER_MAXIMUM: string;
    NOT_A_BOOLEAN: string;
    NOT_AN_ENUM: string;
    REQUIRED: string;
    NOT_ALLOW_NULL: string;
    NOT_ALLOW_PROPERTIES: string;
    NOT_SUITABLE_ARRAY: string;
    NOT_AN_UNIQUE_ARRAY: string;
    NOT_STRONG_PASSWORD: string;
};
export declare abstract class BaseSchema {
    protected options: IsBaseOptions;
    protected errors: any;
    protected value: any;
    protected allowValues: any[];
    get isAllowNull(): boolean;
    optional(optional?: boolean): this;
    nullable(nullable?: boolean): this;
    allow(...values: any[]): this;
    reset(): this;
    getErrors(): any;
    getValue(): any;
    check(value: any): boolean;
    protected appendError(path: string, error: any): this;
    protected abstract checkError(input: {
        value: any;
    }, path: string | undefined): void;
    abstract buildSchema(): Record<string, any>;
}
export declare class StringSchema extends BaseSchema {
    protected options: IsStringOptions;
    constructor(options?: IsStringOptions);
    minLength(num: number): this;
    maxLength(num: number): this;
    format(format: IsStringOptionFormat): this;
    strongPassword(options?: IsStrongPasswordOptions): this;
    allowHtml(allowHtml?: IsStringOptions['allowHtml']): this;
    buildSchema(): {
        type: string | string[];
        minLength: number;
        maxLength: number;
        format: string | RegExp;
    };
    protected checkError(input: {
        value: any;
    }): void;
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
    protected checkError(input: {
        value: any;
    }): void;
}
export declare class BooleanSchema extends BaseSchema {
    protected options: IsBaseOptions;
    constructor(options?: IsBaseOptions);
    buildSchema(): {
        type: string | string[];
    };
    protected checkError(input: {
        value: any;
    }): void;
}
export type ItemSchema = NumberSchema | StringSchema | BooleanSchema | EnumSchema | ObjectSchema<any> | ArraySchema<any>;
export type ObjectSchemaProps<T extends object> = {
    [K in keyof T]: ItemSchema;
};
export declare class ObjectSchema<T extends object> extends BaseSchema {
    private properties?;
    private isWhiteList;
    constructor(properties?: ObjectSchemaProps<T>);
    get keys(): string[];
    whiteList(isWhiteList?: boolean): this;
    resetErrors(): this;
    protected checkError(input: {
        value: any;
    }, path: string): void;
    buildSchema(): {
        type: string | string[];
        required: string[];
        properties: {};
    };
}
export declare class ArraySchema<T extends ItemSchema | ItemSchema[]> extends BaseSchema {
    private itemsProps?;
    protected options: IsArrayOptions;
    private arrayUnique;
    constructor(itemsProps?: T, options?: IsArrayOptions);
    minLength(num: number): this;
    maxLength(num: number): this;
    unique(unique?: boolean): this;
    protected checkError(input: {
        value: any;
    }, path: string): void;
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
    protected checkError(input: {
        value: any;
    }): void;
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
