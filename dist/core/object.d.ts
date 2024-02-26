export declare class Obj {
    private objects;
    constructor(objects: Record<string, any>);
    static pick<T extends object>(source: T, props: string | string[]): import("./registry").RegistryDataType;
    static omit<T extends object>(source: T, props: string | string[]): import("./registry").RegistryDataType;
    static contains(source: object, target: object | string): boolean;
    static excludes<T extends object, K extends keyof T>(target: T, props: K[] | K): Omit<T, K>;
    static extends(target: object, ...sources: object[]): object;
    static isObject(value: any): boolean;
    static from(o: object): Obj;
    contains(target: object | string): boolean;
    extends(...sources: object[]): object;
    reset<T extends object>(newData?: T): {} | T;
}
