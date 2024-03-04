export declare class UtilRaceError extends Error {
}
export declare class Util {
    static clone<T>(src: T): T;
    static callback<T>(fn: any, params?: any[], inst?: any): Promise<T>;
    static resetObject<T extends object>(obj: object, newData?: T): T | {};
    static sort(data: any[] | object, options?: {
        key?: string;
    }): object | any[];
    static baseName(path: string, suffix?: string): string;
    static dirName(path: string): string;
    static race(callback: any, maxSeconds: number): Promise<unknown>;
    static debug(entry: any): void;
}
