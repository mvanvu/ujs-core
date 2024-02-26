export declare class Arr extends Array {
    #private;
    get elements(): any[];
    get currentIndex(): number;
    private static calc;
    static sum<T>(source: T[], options?: {
        key?: string;
    }): number | T;
    static avg<T>(source: T[], options?: {
        key?: string;
    }): number | T;
    static min<T>(source: T[], options?: {
        key?: string;
    }): number | T;
    static max<T>(source: T[], options?: {
        key?: string;
    }): number | T;
    private static compare;
    static intersect(a: any[], b: any[]): any[];
    static diff(a: any[], b: any[]): any[];
    static chunk<T>(array: T[], size?: number): Array<T[]>;
    static from(elements: Iterable<any> | ArrayLike<any>): Arr;
    sum(options?: {
        key?: string;
    }): any;
    avg(options?: {
        key?: string;
    }): any;
    min(options?: {
        key?: string;
    }): any;
    max(options?: {
        key?: string;
    }): any;
    intersect(target: any[]): any[];
    diff(target: any[]): any[];
    chunk(size?: number): any[][];
    reset(): this;
    current(): any;
    first(): any;
    last(): any;
    prev(): any;
    next(): any;
    empty(): this;
    update(elements: Iterable<any> | ArrayLike<any>): this;
}
