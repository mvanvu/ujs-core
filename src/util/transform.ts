'use strict';
import { Is } from './is';
import sanitize from 'sanitize-html';

export class Transform {
   // Trim the string value
   static trim(value: any, options?: { specialChars?: string; pos?: 'left' | 'right' | 'both' }): string {
      const str = Transform.toString(value);
      const chars = options?.specialChars?.split('')?.join('|') ?? '';
      const pos = options?.pos || 'both';
      const regex = /[\n\t\s]/;
      const lftTrim = () => {
         for (let i = 0, n = str.length; i < n; i++) {
            if (!str[i].match(regex) && (!chars.length || !chars.includes(str[i]))) {
               return str.substring(i);
            }
         }

         return '';
      };
      const rgtTrim = () => {
         for (let i = str.length - 1; i >= 0; i--) {
            if (!str[i].match(regex) && (!chars.length || !chars.includes(str[i]))) {
               return str.substring(0, i + 1);
            }
         }

         return '';
      };
      const bothTrim = () => {
         const output = lftTrim().split('');

         for (let i = output.length - 1; i >= 0; i--) {
            if (!output[i].match(regex) && (!chars.length || !chars.includes(output[i]))) {
               break;
            }

            output.splice(i, 1);
         }

         return output.join('');
      };

      switch (pos) {
         case 'left':
            return chars ? lftTrim() : str.trimStart();

         case 'right':
            return chars ? rgtTrim() : str.trimEnd();

         case 'both':
         default:
            return chars ? bothTrim() : str.trim();
      }
   }

   // Convert to string
   static toString(value: any): string {
      const type = typeof value;

      switch (type) {
         case 'string':
            return value;

         case 'object':
            if (Array.isArray(value) || value !== null) {
               return JSON.stringify(value);
            }

         default:
            return String(value);
      }
   }

   // Convert to JSON
   static toJson<T>(value: any, defaultJson?: any[] | Record<string, any>): T {
      const type = typeof value;

      if (type === 'string' && (value[0] === '{' || value[0] === '[')) {
         try {
            return JSON.parse(value);
         } catch {}
      }

      if (type === 'object' && value) {
         return value;
      }

      return <T>(defaultJson || {});
   }

   // Convert to boolean
   static toBoolean(value: any): boolean {
      const type = typeof value;

      switch (type) {
         case 'number':
         case 'bigint':
            return value !== 0;

         case 'boolean':
            return value;

         case 'string':
            value = value.trim().toLowerCase();

            if (value === 'true') {
               return true;
            }

            if (value === 'false') {
               return false;
            }
      }

      return Boolean(value);
   }

   // Convert to number
   static toNumber(value: any): number {
      const type = typeof value;

      switch (type) {
         case 'number':
         case 'bigint':
            return value;

         case 'boolean':
            return value ? 1 : 0;

         default:
            const number = Number(value);

            return isNaN(number) ? 0 : number;
      }
   }

   // Convert to unsigned number
   static toUNumber(value: any) {
      return Math.abs(Transform.toNumber(value));
   }

   // Convert to integer
   static toInt(value: any) {
      return Number.parseInt(Transform.toNumber(value).toString());
   }

   // Convert to unsigned integer
   static toUInt(value: any) {
      return Math.abs(Transform.toInt(value));
   }

   // Convert to unique array
   static toArrayUnique(value: any) {
      if (Array.isArray(value)) {
         const unique = [];

         for (const val of value) {
            if (!unique.length || !unique.find((uni) => Is.equals(uni, val))) {
               unique.push(val);
            }
         }

         return unique;
      }

      return [value];
   }

   // Convert string to array which has no empty element
   static stringToArray(value: any, splitChar = ',') {
      return (typeof value === 'string' ? value : '').split(splitChar).filter((v) => !!v.trim());
   }

   // Convert a string to a safe URL path
   static toPath(value: any) {
      return Transform.toString(value)
         .trim()
         .toLowerCase()
         .replace(/[^a-z0-9-/]/gi, '-')
         .replace(/-+/g, '-')
         .replace(/\/+/g, '/')
         .replace(/^\/+|\/+$/g, '')
         .replace(/^-+|-+$/g, '');
   }

   // Convert a string to alnum
   static toAlnum(value: any) {
      return Transform.toString(value)
         .trim()
         .replace(/[^a-z0-9]/gi, '')
         .toLowerCase();
   }

   static toSafeHTML(value: any, options?: sanitize.IOptions) {
      return sanitize(Transform.toString(value), options);
   }

   static toNoneDiacritics(value: any) {
      return Transform.toString(value)
         .normalize('NFD')
         .replace(/[\u0300-\u036f]/g, '');
   }

   static toNonAccentVietnamese(value: any) {
      value = Transform.toString(value)
         .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
         .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
         .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
         .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
         .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
         .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
         .replace(/đ/g, 'd')
         // Upper
         .replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
         .replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
         .replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
         .replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
         .replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
         .replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
         .replace(/Đ/g, 'D')
         .replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // Huyền sắc hỏi ngã nặng
         .replace(/\u02C6|\u0306|\u031B/g, '');

      return Transform.toNoneDiacritics(value);
   }

   static toASCIIString(value: any) {
      return Transform.toString(value).replace(
         /(?![x00-x7F]|[xC0-xDF][x80-xBF]|[xE0-xEF][x80-xBF]{2}|[xF0-xF7][x80-xBF]{3})./g,
         '',
      );
   }

   static toSafeFileName(value: any): string {
      let name = Transform.toNonAccentVietnamese(value);
      let ext = '';

      if (name.includes('.')) {
         const parts = name.split('.');
         ext = <string>parts.pop();
         name = parts.join('.');
      }

      return `${Transform.toPath(name)}${ext ? `.${ext}` : ''}`;
   }

   static toDefault(value: any, ...defValues: any[]) {
      const noValues = [null, undefined, NaN];

      if (!noValues.includes(value)) {
         return value;
      }

      for (let i = 0, n = defValues.length; i < n; i++) {
         const def = defValues[i];

         if (!noValues.includes(def)) {
            return def;
         }
      }

      return undefined;
   }

   // Clean up value with a list of transform
   static clean(value: any, typeTransform: string | string[], ...params: any[]): any {
      const methodMaps = {};
      Object.getOwnPropertyNames(Transform)
         .filter((name) => typeof Transform[name] === 'function' && !['clean', 'cleanIfType'].includes(name))
         .forEach((name) => (methodMaps[name.toLowerCase()] = Transform[name]));

      if (!Array.isArray(typeTransform)) {
         typeTransform = [typeTransform];
      }

      for (const transform of typeTransform.map((type) => type.toLowerCase())) {
         let callback = methodMaps[transform];

         if (!callback && transform.indexOf('to') !== 0) {
            callback = methodMaps[`to${transform}`];
         }

         if (typeof callback === 'function') {
            value = callback.apply(null, [value, ...params]);
         }
      }

      return value;
   }

   static cleanIfType(
      value: any,
      typeTransform: string | string[],
      type: 'string' | 'boolean' | 'array' | 'object' | 'undefined' | 'null',
   ) {
      switch (type) {
         case 'string':
         case 'boolean':
         case 'undefined':
            return typeof value === type ? Transform.clean(value, typeTransform) : value;

         case 'array':
            return Array.isArray(value) ? Transform.clean(value, typeTransform) : value;

         case 'object':
            return typeof value === type && !Array.isArray(value) && value ? Transform.clean(value, typeTransform) : value;

         case 'null':
            return value === null ? Transform.clean(value, typeTransform) : value;
      }
   }
}
