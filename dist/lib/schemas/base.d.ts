import { IsBaseOptions } from '../../type';
import 'reflect-metadata';
export declare abstract class BaseSchema {
    protected options: IsBaseOptions;
    protected errors?: any;
    protected value?: any;
    isNullable(): boolean;
    isOptional(): boolean;
    isValidate(): boolean;
    setOptions(options: IsBaseOptions): this;
    getOptions(): IsBaseOptions;
    optional(optional?: boolean): this;
    nullable(nullable?: boolean): this;
    allow(...values: any[]): this;
    reset(): this;
    getErrors(): any;
    getValue(): any;
    validate(validate?: boolean): this;
    check(value: any): boolean;
    protected appendError(path: string, error: any): this;
    desc(description: string): this;
    eg(example: any): this;
    decorate(): PropertyDecorator;
    protected abstract checkError(input: {
        value: any;
    }, path: string | undefined): void;
    abstract buildSchema(): Record<string, any>;
    abstract buildSwagger(): Record<string, any>;
    abstract clone(): BaseSchema;
}
