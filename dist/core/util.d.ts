export declare class UtilRaceError extends Error {
}
export declare class Util {
    static clone<T>(src: T): T;
    static callback<T>(fn: any, params?: any[], inst?: any): Promise<T>;
    static sort(data: any[] | object, options?: {
        key?: string;
    }): object | any[];
    static baseName(path: string, suffix?: string): string;
    static dirName(path: string): string;
    static race(callback: any, maxSeconds: number): Promise<unknown>;
    static debug(...entries: any[]): void;
    static debugDev(...entries: any[]): void;
}
