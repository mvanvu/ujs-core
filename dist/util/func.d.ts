export declare function clone<T extends any>(src: T): T;
export declare function extendsObject<T extends Record<string, any>>(target: T | Record<string, any>, ...sources: Record<string, any>[]): T;
export declare function excludeProps<T extends Record<string, any>, K extends keyof T>(obj: T, props: K[] | K): Omit<T, K>;
export declare function callback<T extends Promise<T>>(fn: any, params?: any[], inst?: any): Promise<T>;
export declare function camelToSnackCase(str: string): string;
export declare function snackToCamelCase(str: string): string;
export declare function uFirst(str: string): string;
export declare function lFirst(str: string): string;
export declare function toCapitalize(str: string): string;
export declare function toCamelCase(str: string): string;
export declare function debug(...args: any[]): void;
export declare function hash(str: string, type?: 'md5' | 'sha1' | 'sha256'): string;
export declare function uuid(): string;
export declare function sum(source: number[] | Record<string, any>[], options?: {
    key?: string;
}): number;
export declare function truncate(str: string, maxLength?: number, pad?: string): string;
export declare function union(...elements: any[]): any[];
export declare function first<T extends any>(array: T[]): T | undefined;
export declare function last<T extends any>(array: T[]): T | undefined;
export declare function chunk<T extends any>(array: T[], size?: number): Array<T[]>;
export declare function repeat(char: string, level?: number): string;
export declare function resetObject<T extends object>(obj: object, newData?: T): T | {};
export declare function sort(data: any[] | object, options?: {
    key?: string;
}): object | any[];
export declare function diff(a: any, b: any): any[];
