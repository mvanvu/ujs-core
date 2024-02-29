import { CommonType } from '../type';
export declare class Transform {
    static trim(value: any, options?: {
        specialChars?: string;
        pos?: 'left' | 'right' | 'both';
    }): string;
    static toString(value: any): string;
    static toJsonObject<T = any[] | Record<string, any>>(value: any, defaultJson?: T): T;
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
    static toASCIIString(value: any): any;
    static toSafeFileName(value: any): string;
    static toDefault(value: any, ...defValues: any[]): any;
    static toStripTags(value: any, allowed?: string): string;
    static toSafeHtml(value: any, options?: {
        allowedTags?: string[];
        allowedAttributes?: string[];
    }): string;
    static clean(value: any, typeTransform: string | string[], ...params: any[]): any;
    static cleanIfType(value: any, typeTransform: string | string[], typeValue: CommonType | CommonType[]): any;
}
