import { ObjectRecord } from 'src/type';
export declare class UtilRaceError extends Error {
}
export declare class Util {
    static clone<T>(src: T): T;
    static callback<T>(fn: any, params?: any[], inst?: any): Promise<T>;
    static sort<T extends any[] | ObjectRecord>(data: T, options?: {
        key?: string;
    }): T;
    static baseName(path: string, suffix?: string): string;
    static dirName(path: string): string;
    static race<T>(callback: any, maxMiliseconds: number): Promise<T>;
    static debug(...entries: any[]): void;
    static debugDev(...entries: any[]): void;
}
