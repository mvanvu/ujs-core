type RegistryParamType = string | Record<string, any> | any[];
type RegistryDataType = Record<string, any> | any[];
export declare class Registry {
    private cached;
    private data;
    constructor(data?: RegistryParamType, noRef?: boolean);
    static create(data?: RegistryParamType, noRef?: boolean): Registry;
    merge(data?: RegistryParamType, noRef?: boolean): this;
    parse(data?: RegistryParamType, noRef?: boolean): this;
    private isPathNum;
    get<T>(path: string, defaultValue?: any, filter?: string | string[]): T;
    set(path: string, value: any): this;
    has(path: string): boolean;
    is(path: string, compareValue?: any): boolean;
    remove(path: string): this;
    toObject(): RegistryDataType;
    toString(): string;
    clone(): Registry;
    pick(paths: string[] | string): Registry;
    omit(paths: string[] | string): Registry;
}
export {};
