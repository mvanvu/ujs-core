import { IsArrayOptions } from '../../type';
import { BaseSchema } from './base';
import { type NumberSchema } from './number';
import { type StringSchema } from './string';
import { type BooleanSchema } from './boolean';
import { type EnumSchema } from './enum';
import { type ObjectSchema } from './object';
export type ItemSchema = NumberSchema | StringSchema | BooleanSchema | EnumSchema | ObjectSchema<any> | ArraySchema<any>;
export declare class ArraySchema<T extends ItemSchema | ItemSchema[]> extends BaseSchema {
    private itemsProps?;
    protected options: IsArrayOptions;
    private arrayUnique;
    constructor(itemsProps?: T, options?: IsArrayOptions);
    minLength(num: number): this;
    maxLength(num: number): this;
    unique(unique?: boolean): this;
    protected checkError(input: {
        value: any;
    }, path: string): void;
    buildSchema(): {
        type: string | string[];
        prefixItems: any[];
        items: {};
    };
}
