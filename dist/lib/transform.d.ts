import { LastElement, ObjectRecord, DefaultObject, TransformType } from '../type';
export declare class Transform {
    static trim(value: any, options?: {
        specialChars?: string;
        pos?: 'left' | 'right' | 'both';
    }): string;
    static toString(value: any): string;
    static toJsonObject<T extends any[] | ObjectRecord>(value: any, defaultJson?: T): DefaultObject<T>;
    static toBoolean(value: any): boolean;
    static toNumber(value: any): number;
    static toArrayUnique(value: any): any[];
    static toPath(value: any): string;
    static toSlug(value: any): string;
    static toAlnum(value: any): string;
    static toNoneDiacritics(value: any): string;
    static toNonAccent(value: any): string;
    static toASCIIString(value: any): string;
    static toSafeFileName(value: any): string;
    static toDefault<T extends any[]>(value: any, ...defValues: T): LastElement<T>;
    static toStripTags(value: any, allowedTags?: string): string;
    static toSafeHtml(value: any, options?: {
        allowedTags?: string[];
        allowedAttributes?: string[];
    }): string;
    static clean<T>(value: T, toTypes: TransformType | TransformType[]): T;
}
