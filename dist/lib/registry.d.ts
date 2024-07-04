import { ObjectRecord, EventHandler, PathValue, Path, IsEqual, NestedOmit, NestedPick, TransformType } from '../type';
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
export declare class Registry<TData extends any, TPath = PathOf<TData>> {
    private consistent;
    private eventEmitter;
    private cached;
    private data;
    constructor(data?: TData, options?: RegistryOptions);
    static from<TData extends any, TPath = PathOf<TData>>(data?: TData, options?: RegistryOptions): Registry<TData, TPath>;
    extends(data: any): this;
    parse(data?: any, options?: {
        validate?: boolean;
        clone?: boolean;
    }): this;
    validate(data?: any): this;
    isValidData(data?: any): boolean;
    private isPathNum;
    private preparePath;
    get<TResult = unknown, PathOrKey extends TPath = any>(path: PathOrKey, defaultValue?: any, filter?: TransformType | TransformType[]): IsEqual<TResult, unknown> extends true ? (PathOrKey extends Path<TData> ? PathValue<TData, PathOrKey> : TResult) : TResult;
    private validateConsistent;
    set(path: TPath, value: any, validate?: boolean): this;
    initPathValue<T = any>(path: TPath, value: T, validate?: boolean): T;
    has<Path extends TPath>(path: Path): boolean;
    is(path: TPath, compareValue?: any): boolean;
    isCached(path: string): boolean;
    isPathArray(path?: TPath): boolean;
    isPathObject(path?: TPath): boolean;
    isPathFlat(path: TPath): boolean;
    remove(path: TPath): this;
    toString(): string;
    valueOf<T extends RegistryDataType = TData>(): T;
    clone(): Registry<TData, TPath>;
    pick<TInclude extends TPath>(paths: TInclude[] | TInclude): Registry<NestedPick<TData, TInclude>>;
    omit<TExclude extends TPath>(paths: TExclude[] | TExclude): Registry<NestedOmit<TData, TExclude>>;
    watch(paths: TPath[] | TPath, callback: EventHandler['handler']): void;
    isEmpty(): boolean;
}
export {};
