import { IsNumberOptions } from '../../type';
import { ArraySchema } from './array';
import { BaseSchema } from './base';
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
        description: string;
    };
    buildSwagger(): Record<string, any>;
    protected checkError(input: {
        value: any;
    }): void;
    array(): ArraySchema<this>;
    clone(): NumberSchema;
}
