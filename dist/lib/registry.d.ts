import { ObjectRecord, EventHandler, Path } from '../type';
export type RegistryDataType = ObjectRecord | any[];
export declare class RegistryDataError extends Error {
}
export declare class Registry<TData = any> {
    #private;
    private cached;
    private data;
    constructor(data?: TData, options?: {
        validate?: boolean;
        clone?: boolean;
    });
    static from<TData = any>(data?: TData, options?: {
        validate?: boolean;
        clone?: boolean;
    }): Registry<TData>;
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
    get<T, TP = Path<TData> extends never ? string : Path<TData>>(path: TP, defaultValue?: any, filter?: string | string[]): T;
    set<TP = Path<TData> extends never ? string : Path<TData>>(path: TP, value: any, validate?: boolean): this;
    initPathValue<T>(path: string, value: T, validate?: boolean): T;
    has<TP = Path<TData> extends never ? string : Path<TData>>(path: TP): boolean;
    is<TP = Path<TData> extends never ? string : Path<TData>>(path: TP, compareValue?: any): boolean;
    isCached(path: string): boolean;
    isPathArray<TP = Path<TData> extends never ? string : Path<TData>>(path?: TP): boolean;
    isPathObject<TP = Path<TData> extends never ? string : Path<TData>>(path?: TP): boolean;
    isPathFlat<TP = Path<TData> extends never ? string : Path<TData>>(path: TP): boolean;
    remove<TP = Path<TData> extends never ? string : Path<TData>>(path: TP): this;
    toString(): string;
    valueOf<T extends RegistryDataType>(): T;
    clone(): Registry;
    pick<TP = Path<TData> extends never ? string : Path<TData>>(paths: TP[] | TP): Registry;
    omit<TP = Path<TData> extends never ? string : Path<TData>>(paths: TP[] | TP): Registry;
    watch<TP = Path<TData> extends never ? string : Path<TData>>(paths: TP[] | TP, callback: EventHandler['handler']): void;
}
