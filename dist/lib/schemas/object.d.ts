import { ArraySchema, ItemSchema } from './array';
import { BaseSchema } from './base';
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
        description: string;
        example: any;
    };
    array(): ArraySchema<this>;
}
