import { ObjectRecord } from 'src/type';
export type RegistryDataType = ObjectRecord | any[];
export declare class RegistryDataError extends Error {
}
export declare class Registry {
    private cached;
    private data;
    constructor(data?: any, options?: {
        validate?: boolean;
        clone?: boolean;
    });
    static from(data?: any, options?: {
        validate?: boolean;
        clone?: boolean;
    }): Registry;
    merge(data: any, validate?: boolean): Registry;
    parse(data?: any, options?: {
        validate?: boolean;
        clone?: boolean;
    }): Registry;
    validate(data?: any): Registry;
    isValidData(data?: any): boolean;
    private isPathNum;
    get<T>(path: string, defaultValue?: any, filter?: string | string[]): T;
    set(path: string, value: any, validate?: boolean): Registry;
    initPathValue<T>(path: string, value: T, validate?: boolean): T;
    has(path: string): boolean;
    is(path: string, compareValue?: any): boolean;
    isCached(path: string): boolean;
    isPathArray(path?: string): boolean;
    isPathObject(path?: string): boolean;
    isPathFlat(path: string): boolean;
    remove(path: string): Registry;
    toString(): string;
    valueOf<T extends RegistryDataType>(): T;
    clone(): Registry;
    pick(paths: string[] | string): Registry;
    omit(paths: string[] | string): Registry;
}
