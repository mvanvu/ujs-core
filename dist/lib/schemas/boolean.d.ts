import { IsBaseOptions } from '../../type';
import { ArraySchema } from './array';
import { BaseSchema } from './base';
export declare class BooleanSchema extends BaseSchema {
    protected options: IsBaseOptions;
    constructor(options?: IsBaseOptions);
    buildSchema(): {
        type: string | string[];
        description: string;
        example: any;
    };
    protected checkError(input: {
        value: any;
    }): void;
    array(): ArraySchema<this>;
}
