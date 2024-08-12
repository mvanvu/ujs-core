import { EnumElement, IsBaseOptions, IsNumberOptions, IsStringOptions } from '../type';
import { ArraySchema, BooleanSchema, EnumSchema, ItemSchema, NumberSchema, ObjectSchema, ObjectSchemaProps, StringSchema } from './schemas';
export declare class Schema {
    static string(options?: IsStringOptions): StringSchema;
    static number(options?: IsNumberOptions): NumberSchema;
    static boolean(options?: IsBaseOptions): BooleanSchema;
    static enum(emum: EnumElement[]): EnumSchema;
    static object<T extends object>(properties?: ObjectSchemaProps<T>): ObjectSchema<T>;
    static array<T extends ItemSchema | ItemSchema[]>(itemsProps?: T): ArraySchema<T>;
}
