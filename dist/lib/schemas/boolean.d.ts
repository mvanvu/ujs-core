import { ArraySchema } from './array';
import { BaseSchema } from './base';
export declare class BooleanSchema extends BaseSchema {
    buildSchema(): {
        type: string | string[];
        description: string;
        example: any;
    };
    buildSwagger(): Record<string, any>;
    protected checkError(input: {
        value: any;
    }): void;
    array(): ArraySchema<this>;
    clone(): BooleanSchema;
}
