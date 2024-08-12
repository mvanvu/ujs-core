import { IsBaseOptions } from '../../type';
import { ArraySchema } from './array';
import { BaseSchema } from './base';
export declare class BooleanSchema extends BaseSchema {
    protected options: IsBaseOptions;
    constructor(options?: IsBaseOptions);
    buildSchema(): {
        type: string | string[];
    };
    protected checkError(input: {
        value: any;
    }): void;
    array(): ArraySchema<this>;
}
