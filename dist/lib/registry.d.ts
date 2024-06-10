import { ObjectRecord, EventHandler, PathValue, Path, IsEqual } from '../type';
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
type PathOf<T> = T extends object ? Path<T> : string;
export declare class Registry<TData = unknown, TPath = PathOf<TData>> {
    private consistent;
    private eventEmitter;
    private cached;
    private data;
    constructor(data?: any, options?: RegistryOptions);
    static from<TData = unknown, TPath = PathOf<TData>>(data?: any, options?: RegistryOptions): Registry<TData, TPath>;
    extends(data: any): this;
    parse(data?: any, options?: {
        validate?: boolean;
        clone?: boolean;
    }): this;
    validate(data?: any): this;
    isValidData(data?: any): boolean;
    private isPathNum;
    private preparePath;
    get<TResult = unknown, PathOrKey extends TPath = any>(path: PathOrKey, defaultValue?: any, filter?: string | string[]): IsEqual<TResult, unknown> extends true ? (PathOrKey extends Path<TData> ? PathValue<TData, PathOrKey> : TResult) : TResult;
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
    isEmpty(): boolean;
}
export {};
