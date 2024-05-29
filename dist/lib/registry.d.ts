import { ObjectRecord, EventHandler } from '../type';
export type RegistryDataType = ObjectRecord | any[];
export declare class RegistryDataError extends Error {
}
export declare class RegistryConsistentError extends Error {
}
export type RegistryOptions = {
    validate?: boolean;
    clone?: boolean;
    consistent?: boolean;
};
export declare class Registry<TPath = string> {
    private consistent;
    private eventEmitter;
    private cached;
    private data;
    constructor(data?: any, options?: RegistryOptions);
    static from<TPath = string>(data?: any, options?: RegistryOptions): Registry<TPath>;
    extends(data: any, validate?: boolean): this;
    parse(data?: any, options?: {
        validate?: boolean;
        clone?: boolean;
    }): this;
    validate(data?: any): this;
    isValidData(data?: any): boolean;
    private isPathNum;
    private preparePath;
    get<T = any>(path: TPath, defaultValue?: any, filter?: string | string[]): T;
    private validateConsistent;
    set(path: TPath, value: any, validate?: boolean): this;
    initPathValue<T = any>(path: TPath, value: T, validate?: boolean): T;
    has(path: TPath): boolean;
    is(path: TPath, compareValue?: any): boolean;
    isCached(path: string): boolean;
    isPathArray(path?: TPath): boolean;
    isPathObject(path?: TPath): boolean;
    isPathFlat(path: TPath): boolean;
    remove(path: TPath): this;
    toString(): string;
    valueOf<T extends RegistryDataType>(): T;
    clone(): Registry<TPath>;
    pick(paths: TPath[] | TPath): Registry<TPath>;
    omit(paths: TPath[] | TPath): Registry<TPath>;
    watch(paths: TPath[] | TPath, callback: EventHandler['handler']): void;
}
