import { IsArrayOptions } from '../../type';
import { BaseSchema } from './base';
import { type ObjectSchema } from './object';
export type ItemSchema = BaseSchema | ObjectSchema<any> | ArraySchema<any>;
export declare class ArraySchema<T extends ItemSchema | ItemSchema[]> extends BaseSchema {
    protected itemsProps?: T;
    protected options: IsArrayOptions;
    constructor(itemsProps?: T);
    getItems(): ItemSchema | ItemSchema[] | undefined;
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
        description: IsArrayOptions;
        example: any;
    };
    buildSwagger(): Record<string, any>;
    clone(): ArraySchema<T>;
}
