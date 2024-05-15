import { ObjectRecord, EventHandler, Path } from '../type';
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
export declare class Registry<TData = any> {
    #private;
    private cached;
    private data;
    constructor(data?: TData, options?: RegistryOptions);
    static from<TData = any>(data?: TData, options?: RegistryOptions): Registry<TData>;
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
    get<T = any>(path: Path<TData>, defaultValue?: any, filter?: string | string[]): T;
    private consistent;
    set(path: Path<TData>, value: any, validate?: boolean): this;
    initPathValue<T = any>(path: Path<TData>, value: T, validate?: boolean): T;
    has(path: Path<TData>): boolean;
    is(path: Path<TData>, compareValue?: any): boolean;
    isCached(path: string): boolean;
    isPathArray(path?: Path<TData>): boolean;
    isPathObject(path?: Path<TData>): boolean;
    isPathFlat(path: Path<TData>): boolean;
    remove(path: Path<TData>): this;
    toString(): string;
    valueOf<T extends RegistryDataType>(): T;
    clone(): Registry;
    pick(paths: Path<TData>[] | Path<TData>): Registry;
    omit(paths: Path<TData>[] | Path<TData>): Registry;
    watch(paths: Path<TData>[] | Path<TData>, callback: EventHandler['handler']): void;
}
