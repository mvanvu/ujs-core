export declare function clone<T>(src: T): T;
export declare function callback<T>(fn: any, params?: any[], inst?: any): Promise<T>;
export declare function resetObject<T extends object>(obj: object, newData?: T): T | {};
export declare function sort(data: any[] | object, options?: {
    key?: string;
}): object | any[];
export declare function baseName(path: string, suffix?: string): string;
export declare function dirName(path: string): string;
