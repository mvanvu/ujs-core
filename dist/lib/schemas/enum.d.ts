import { EnumArgs, EnumElement } from '../../type';
import { ArraySchema } from './array';
import { BaseSchema } from './base';
export declare class EnumSchema extends BaseSchema {
    private data?;
    constructor(data?: EnumArgs);
    get elements(): EnumElement[];
    protected checkError(input: {
        value: any;
    }): void;
    buildSchema(): {
        type: string[];
        enum: EnumElement[];
        description: string;
        example: any;
    };
    array(): ArraySchema<this>;
}
