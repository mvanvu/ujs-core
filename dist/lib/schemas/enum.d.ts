import { EnumElement } from '../../type';
import { BaseSchema } from './base';
export declare class EnumSchema extends BaseSchema {
    private emum?;
    constructor(emum?: EnumElement[]);
    valid(enumArray: EnumElement[]): this;
    protected checkError(input: {
        value: any;
    }): void;
    buildSchema(): {
        type: string[];
        enum: EnumElement[];
    };
}
