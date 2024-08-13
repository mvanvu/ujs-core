import { IsBaseOptions } from '../../type';
import 'reflect-metadata';
export declare abstract class BaseSchema {
    protected options: IsBaseOptions;
    protected errors: any;
    protected value: any;
    protected allowValues: any[];
    protected description: string;
    protected example: any;
    get isAllowNull(): boolean;
    optional(optional?: boolean): this;
    nullable(nullable?: boolean): this;
    allow(...values: any[]): this;
    reset(): this;
    getErrors(): any;
    getValue(): any;
    check(value: any): boolean;
    protected appendError(path: string, error: any): this;
    desc(description: string): this;
    eg(example: any): this;
    decorate(): PropertyDecorator;
    protected abstract checkError(input: {
        value: any;
    }, path: string | undefined): void;
    abstract buildSchema(): Record<string, any>;
}
