export declare class Arr extends Array {
    #private;
    get elements(): any[];
    get currentIndex(): number;
    static calc(source: any[], options: {
        type: 'sum' | 'avg' | 'min' | 'max';
        key?: string;
    }): any;
    static sum(source: any[], options?: {
        key?: string;
    }): number;
    static avg(source: any[], options?: {
        key?: string;
    }): number;
    static min<T>(source: any[], options?: {
        key?: string;
    }): T;
    static max<T>(source: any[], options?: {
        key?: string;
    }): T;
    static compare<T>(a: any[], b: any[], type: 'intersect' | 'diff'): T[];
    static intersect<T>(a: any[], b: any[]): T[];
    static diff<T>(a: any[], b: any[]): T[];
    static chunk<T>(array: T[], size?: number): Array<T[]>;
    static from(elements: Iterable<any> | ArrayLike<any>): Arr;
    sum(options?: {
        key?: string;
    }): number;
    avg(options?: {
        key?: string;
    }): number;
    min<T>(options?: {
        key?: string;
    }): T;
    max<T>(options?: {
        key?: string;
    }): T;
    intersect<T>(target: any[]): T[];
    diff<T>(target: any[]): T[];
    chunk<T>(size?: number): Array<T[]>;
    reset(): this;
    current<T>(): T | undefined;
    first<T>(): T | undefined;
    last<T>(): T | undefined;
    prev<T>(): T | undefined;
    next<T>(): T | undefined;
    walk<T>(index: number | 'first' | 'last' | 'prev' | 'next', callback: Function): T | undefined;
    empty(): this;
    update(elements: Iterable<any> | ArrayLike<any>): this;
}
