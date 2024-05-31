import { NumberFormatOptions, ObjectRecord } from '../type';
export declare class UtilRaceError extends Error {
}
export declare class Util {
    static clone<T extends any>(src: T): typeof src;
    static call<T>(instanceThis: any, fn: any, ...params: any[]): T;
    static callAsync<T>(instanceThis: any, fn: any, ...params: any[]): Promise<T>;
    static sort<T extends any[] | ObjectRecord>(data: T, options?: {
        key?: string;
        desc?: boolean;
    }): T;
    static baseName(path: string, suffix?: string): string;
    static dirName(path: string): string;
    static race<T>(callback: any, maxMiliseconds: number): Promise<T>;
    static debug(...entries: any[]): void;
    static debugDev(...entries: any[]): void;
    static numberFormat(number: number, options?: NumberFormatOptions): string;
    static uFirst(str: string): string;
    static lFirst(str: string): string;
    static toCapitalize(str: string, ignoreNoneWord?: boolean): string;
    static toCamelCase(str: string): string;
    static camelToSnackCase(str: string): string;
    static snackToCamelCase(str: string): string;
    static cloneObjectToCamelCase<TResult = ObjectRecord>(obj: ObjectRecord): TResult;
    static truncate(str: string, options?: {
        maxLength?: number;
        wordCount?: boolean;
        pad?: string;
    }): string;
    static repeat(char: string, level?: number): string;
}
