import { ClassConstructor } from '../../type';
import { ArraySchema } from './array';
import { ObjectSchema, ObjectSchemaProps } from './object';
import 'reflect-metadata';
export declare class ClassRefSchema<T extends object> extends ObjectSchema<T> {
    private readonly classRef;
    constructor(classRef: ClassConstructor<T>);
    static collectAllProperties<T extends object>(classRef: ClassConstructor<T>): {
        schemaProps: ObjectSchemaProps<T>;
        swaggerProps: Record<string, any>;
    };
    static Pick<T extends object, K extends keyof T>(classRef: ClassConstructor<T>, properties: K[]): ClassConstructor<Pick<T, (typeof properties)[number]>>;
    static Omit<T extends object, K extends keyof T>(classRef: ClassConstructor<T>, properties: K[]): ClassConstructor<Omit<T, (typeof properties)[number]>>;
    static Partial<T extends object>(classRef: ClassConstructor<T>): ClassConstructor<Partial<T>>;
    buildSwagger(): Record<string, any>;
    array(): ArraySchema<this>;
    clone(): ClassRefSchema<T>;
}
