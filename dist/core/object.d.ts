export declare class Obj {
    private objects;
    constructor(objects: Record<string, any>);
    static pick<T extends object>(source: T, props: string | string[]): import("./registry").RegistryDataType;
    static omit<T extends object>(source: T, props: string | string[]): import("./registry").RegistryDataType;
    static contains(source: object, target: object | string): boolean;
    static excludes<T extends object, K extends keyof T>(target: T, props: K[] | K): Omit<T, K>;
    static extends(target: object, ...sources: object[]): object;
    static reset<T extends object>(obj: object, newData?: T): T | {};
    static from(o: Record<string, any>): Obj;
    static initPropValue<T>(o: Record<string, any>, prop: string, value: T): T;
    contains(target: Record<string, any> | string): boolean;
    extends(...sources: Record<string, any>[]): object;
    reset<T extends Record<string, any>>(newData?: T): {} | T;
    initPropValue<T>(prop: string, value: T): T;
    valueOf(): Record<string, any>;
    toString(): string;
}
