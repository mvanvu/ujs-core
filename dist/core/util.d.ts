export declare class Util {
    static clone<T>(src: T): T;
    static callback<T>(fn: any, params?: any[], inst?: any): Promise<T>;
    static resetObject<T extends object>(obj: object, newData?: T): T | {};
    static sort(data: any[] | object, options?: {
        key?: string;
    }): object | any[];
    static baseName(path: string, suffix?: string): string;
    static dirName(path: string): string;
}
