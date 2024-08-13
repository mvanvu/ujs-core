import { IsStringOptionFormat, IsStringOptions, IsStrongPasswordOptions } from '../../type';
import { ArraySchema } from './array';
import { BaseSchema } from './base';
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
        description: string;
        example: any;
        format: string | RegExp;
    };
    protected checkError(input: {
        value: any;
    }): void;
    array(): ArraySchema<this>;
}
