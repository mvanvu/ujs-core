import { IsValidType, LastElement, ObjectRecord, DefaultObject } from '../type';
export declare class Transform {
    static trim(value: any, options?: {
        specialChars?: string;
        pos?: 'left' | 'right' | 'both';
    }): string;
    static toString(value: any): string;
    static toJsonObject<T extends any[] | ObjectRecord>(value: any, defaultJson?: T): DefaultObject<T>;
    static toBoolean(value: any): boolean;
    static toNumber(value: any): number;
    static toUNumber(value: any): number;
    static toInt(value: any): number;
    static toUInt(value: any): number;
    static toArrayUnique(value: any): any[];
    static toPath(value: any): string;
    static toAlnum(value: any): string;
    static toNoneDiacritics(value: any): string;
    static toNonAccentVietnamese(value: any): string;
    static toASCIIString(value: any): string;
    static toSafeFileName(value: any): string;
    static toDefault<T extends any[]>(value: any, ...defValues: T): LastElement<T>;
    static toStripTags(value: any, allowedTags?: string): string;
    static toSafeHtml(value: any, options?: {
        allowedTags?: string[];
        allowedAttributes?: string[];
    }): string;
    static toLowerCase(value: any): string;
    static toUpperCase(value: any): string;
    static clean(value: any, typeTransform: string | string[], ...params: any[]): any;
    static cleanIfType(value: any, typeTransform: string | string[], typeValue: IsValidType | IsValidType[]): any;
}
