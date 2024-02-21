'use strict';
import { DateTime, DateTimeLike } from './datetime';
import { Is } from './is';

export class JWTError extends Error {}
export class InvalidJWT extends JWTError {}
export class ExpiredJWT extends JWTError {}
export class Hash {
   static getCrypto() {
      // Node & Browser support
      return typeof crypto !== 'undefined'
         ? crypto
         : typeof window !== 'undefined'
         ? window.crypto || window['msCrypto']
         : void 0;
   }

   static randomBytes(size: number) {
      const crypto = Hash.getCrypto();

      if (crypto !== void 0) {
         if (crypto.randomBytes !== void 0) {
            return crypto.randomBytes;
         }

         if (crypto.getRandomValues !== void 0) {
            const bytes = new Uint8Array(size);
            crypto.getRandomValues(bytes);

            return bytes;
         }
      }

      // Fallback with Math.random()
      const r = [];

      for (let i = size; i > 0; i--) {
         r.push(Math.floor(Math.random() * 256));
      }

      return r;
   }

   static uuid() {
      const crypto = Hash.getCrypto();

      if (typeof crypto?.randomUUID === 'function') {
         return crypto.randomUUID();
      }

      let buf: any,
         bufIdx = 0;
      const hexBytes = new Array(256);

      // Pre-calculate toString(16) for speed
      for (let i = 0; i < 256; i++) {
         hexBytes[i] = (i + 0x100).toString(16).substring(1);
      }

      // Buffer random numbers for speed
      // Reduce memory usage by decreasing this number (min 16)
      // or improve speed by increasing this number (try 16384)
      const BUFFER_SIZE = 4096;

      // Buffer some random bytes for speed
      if (buf === void 0 || bufIdx + 16 > BUFFER_SIZE) {
         bufIdx = 0;
         buf = Hash.randomBytes(BUFFER_SIZE);
      }

      const b = Array.prototype.slice.call(buf, bufIdx, (bufIdx += 16));
      b[6] = (b[6] & 0x0f) | 0x40;
      b[8] = (b[8] & 0x3f) | 0x80;

      return (
         hexBytes[b[0]] +
         hexBytes[b[1]] +
         hexBytes[b[2]] +
         hexBytes[b[3]] +
         '-' +
         hexBytes[b[4]] +
         hexBytes[b[5]] +
         '-' +
         hexBytes[b[6]] +
         hexBytes[b[7]] +
         '-' +
         hexBytes[b[8]] +
         hexBytes[b[9]] +
         '-' +
         hexBytes[b[10]] +
         hexBytes[b[11]] +
         hexBytes[b[12]] +
         hexBytes[b[13]] +
         hexBytes[b[14]] +
         hexBytes[b[15]]
      );
   }

   static async sha256(str: string): Promise<string> {
      const crypto = Hash.getCrypto();

      if (typeof crypto?.subtle?.digest === 'function') {
         return await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then((h: any) => {
            const hexes = [],
               view = new DataView(h);

            for (let i = 0; i < view.byteLength; i += 4) {
               hexes.push(('00000000' + view.getUint32(i).toString(16)).slice(-8));
            }

            return hexes.join('');
         });
      }

      throw new Error('Crypto not available in your environment');
   }

   static base64Encode(str: string) {
      return btoa(str);
   }

   static base64Decode(str: string) {
      return atob(str);
   }

   static base64UrlEncode(str: string) {
      return Hash.base64Encode(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
   }

   static base64UrlDecode(str: string) {
      str = str.replace(/-/g, '+').replace(/_/g, '/');
      const padLength = str.length % 4;

      if (padLength) {
         str += '='.repeat(4 - padLength);
      }

      return Hash.base64Decode(str);
   }

   static jwt() {
      return new (class {
         readonly validHeader = { alg: 'HS256', typ: 'JWT' };

         async create(data: any, options: { iat: DateTimeLike; secret: string }) {
            const iat = DateTime.create(options.iat);

            if (!iat.valid) {
               throw new InvalidJWT('INVALID_JWT_IAT');
            }

            const header = Hash.base64UrlEncode(JSON.stringify(this.validHeader));
            const payload = Hash.base64UrlEncode(JSON.stringify({ data, iat: iat.iso }));
            const signature = Hash.base64UrlEncode(await Hash.sha256(`${header}.${payload}.${options.secret}`));

            return `${header}.${payload}.${signature}`;
         }

         async verify(token: string, options: { secret: string }) {
            try {
               const parts = token.split('.');

               if (parts.length !== 3) {
                  throw false;
               }

               const header = JSON.parse(Hash.base64UrlDecode(parts[0]));
               const payload = JSON.parse(Hash.base64UrlDecode(parts[1]));
               let d: DateTime | false;

               if (
                  !Is.equals(header, this.validHeader) ||
                  !Is.object(payload) ||
                  !Is.equals(Object.keys(payload).sort(), ['data', 'iat']) ||
                  !(d = Is.date(payload.iat)) ||
                  Hash.base64UrlEncode(await Hash.sha256(`${parts[0]}.${parts[1]}.${options.secret}`)) !== parts[2]
               ) {
                  throw false;
               }

               if (d.lt('now', 'second')) {
                  throw new ExpiredJWT('EXPRIED_JWT');
               }

               return payload.data;
            } catch (e) {
               if (e instanceof JWTError) {
                  throw e;
               }

               throw new InvalidJWT('INVALID_JWT');
            }
         }
      })();
   }
}
