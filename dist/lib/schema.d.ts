import { IsBaseOptions, IsNumberOptions, IsStringOptionFormat, IsStringOptions, IsStrongPasswordOptions } from '../type';
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
    format(format: IsStringOptionFormat): this;
    strongPassword(options?: Omit<IsStrongPasswordOptions, 'isArray' | 'optional' | 'nullable'>): this;
}
export declare class NumberSchema extends BaseSchema {
    protected options: IsNumberOptions;
    integer(integer?: boolean): this;
    min(min: number): this;
    max(max: number): this;
}
export declare class BooleanSchema extends BaseSchema {
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
}
export declare class ArraySchema<T extends ItemSchema | ItemSchema[]> extends BaseSchema {
    private itemsProps?;
    constructor(itemsProps?: T);
    check(value: any): boolean;
}
export declare class Schema {
    static string(): StringSchema;
    static number(): NumberSchema;
    static boolean(): BooleanSchema;
    static object<T extends object>(properties?: ObjectSchemaProps<T>): ObjectSchema<T>;
    static array<T extends ItemSchema | ItemSchema[]>(itemsProps?: T): ArraySchema<T>;
}
