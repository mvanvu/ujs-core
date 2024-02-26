import { DateTimeLike } from './datetime';
export declare class Hash {
    static getCrypto(): any;
    static randomBytes(size: number): any;
    static uuid(): any;
    static sha256(str: string): Promise<string>;
    static encodeBase64(str: string): string;
    static decodeBase64(str: string): string;
    static base64UrlEncode(str: string): string;
    static base64UrlDecode(str: string): string;
    static jwt(): JWT;
}
export declare class JWTError extends Error {
}
export declare class JWTErrorInvalid extends JWTError {
    constructor();
}
export declare class JWTErrorExpired extends JWTError {
    constructor();
}
export declare class JWT {
    readonly validHeader: {
        alg: string;
        typ: string;
    };
    static readonly INVALID_TOKEN = "INVALID_TOKEN";
    static readonly EXPIRED_TOKEN = "INVALID_IAT";
    static readonly EXPIRED = "EXPIRED_TOKEN";
    sign(data: any, options: {
        iat: DateTimeLike;
        secret: string;
    }): Promise<string>;
    verify(token: string, options: {
        secret: string;
    }): Promise<any>;
}
