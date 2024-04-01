import { ObjectRecord, EventHandler } from '../type';
export type RegistryDataType = ObjectRecord | any[];
export declare class RegistryDataError extends Error {
}
export declare class Registry {
    #private;
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
    merge(data: any, validate?: boolean): this;
    extends(data: any, validate?: boolean): this;
    parse(data?: any, options?: {
        validate?: boolean;
        clone?: boolean;
    }): this;
    validate(data?: any): this;
    isValidData(data?: any): boolean;
    private isPathNum;
    private preparePath;
    get<T>(path: string, defaultValue?: any, filter?: string | string[]): T;
    set(path: string, value: any, validate?: boolean): this;
    initPathValue<T>(path: string, value: T, validate?: boolean): T;
    has(path: string): boolean;
    is(path: string, compareValue?: any): boolean;
    isCached(path: string): boolean;
    isPathArray(path?: string): boolean;
    isPathObject(path?: string): boolean;
    isPathFlat(path: string): boolean;
    remove(path: string): this;
    toString(): string;
    valueOf<T extends RegistryDataType>(): T;
    clone(): Registry;
    pick(paths: string[] | string): Registry;
    omit(paths: string[] | string): Registry;
    watch(paths: string[] | string, callback: EventHandler['handler']): void;
}
