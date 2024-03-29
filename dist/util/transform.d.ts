import sanitize from 'sanitize-html';
export declare class Transform {
    static trim(value: any, options?: {
        specialChars?: string;
        pos?: 'left' | 'right' | 'both';
    }): string;
    static toString(value: any): string;
    static toJson<T>(value: any, defaultJson?: any[] | Record<string, any>): T;
    static toBoolean(value: any): boolean;
    static toNumber(value: any): number;
    static toUNumber(value: any): number;
    static toInt(value: any): number;
    static toUInt(value: any): number;
    static toArrayUnique(value: any): any[];
    static stringToArray(value: any, splitChar?: string): string[];
    static toPath(value: any): string;
    static toAlnum(value: any): string;
    static toSafeHTML(value: any, options?: sanitize.IOptions): string;
    static toNoneDiacritics(value: any): string;
    static toNonAccentVietnamese(value: any): string;
    static toASCIIString(value: any): string;
    static toSafeFileName(value: any): string;
    static toDefault(value: any, ...defValues: any[]): any;
    static clean(value: any, typeTransform: string | string[], ...params: any[]): any;
    static cleanIfType(value: any, typeTransform: string | string[], type: 'string' | 'boolean' | 'array' | 'object' | 'undefined' | 'null'): any;
}
