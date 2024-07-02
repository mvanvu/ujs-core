'use strict';
import { Is } from './is';
import { NumberFormatOptions, ObjectRecord } from '../type';

export class UtilRaceError extends Error {}
export class Util {
   static clone<T extends any>(src: T): typeof src {
      if (Is.primitive(src)) {
         return src;
      }

      const orgSrc = src as any;

      if (Is.object(orgSrc) && Is.func(orgSrc.clone)) {
         return orgSrc.clone();
      }

      if (orgSrc instanceof Date) {
         return new Date(orgSrc) as typeof src;
      }

      if (orgSrc instanceof RegExp) {
         return new RegExp(orgSrc.source, orgSrc.flags) as typeof src;
      }

      if (orgSrc instanceof Set) {
         const set = new Set();
         orgSrc.forEach((val) => set.add(Util.clone(val)));

         return set as typeof src;
      }

      if (orgSrc instanceof Map) {
         const map = new Map();
         orgSrc.forEach((val, key) => map.set(key, Util.clone(val)));

         return map as typeof src;
      }

      if (Is.array(orgSrc)) {
         const array = [];
         orgSrc.forEach((val) => array.push(Util.clone(val)));

         return array as typeof src;
      }

      if (Is.object(orgSrc)) {
         const obj = {};
         Object.assign(obj, ...Object.keys(orgSrc).map((key) => ({ [key]: Util.clone(orgSrc[key]) })));

         return obj as typeof src;
      }

      if (typeof (orgSrc as any)?.constructor === 'function') {
         const val = typeof (orgSrc as any).valueOf === 'function' ? (orgSrc as any).valueOf() : undefined;

         if (val && Object(val) !== val) {
            return new ((orgSrc as any).constructor as any)(val);
         }
      }

      // Fallback just returns the original src
      return orgSrc;
   }

   static call<T>(instanceThis: any, fn: any, ...params: any[]): T {
      return Is.class(fn) ? new fn(...params) : Is.callable(fn) ? fn.call(instanceThis, ...params) : fn;
   }

   static callAsync<T>(instanceThis: any, fn: any, ...params: any[]): Promise<T> {
      return Promise.resolve<T>(Util.call(instanceThis, fn, ...params));
   }

   static sort<T extends any[] | ObjectRecord>(data: T, options?: { key?: string; desc?: boolean }): T {
      const k = options?.key;
      const desc = options?.desc === true;
      const compare = (a: any, b: any) => (desc ? (a > b ? -1 : a < b ? 1 : 0) : a < b ? -1 : a > b ? 1 : 0);

      if (Array.isArray(data)) {
         if (k) {
            data.sort((a, b) => {
               if (Is.object(a) && Is.object(b)) {
                  return compare(a[k], b[k]);
               }

               return compare(a, b);
            });
         } else {
            data.sort(compare);
         }
      } else if (Is.object(data)) {
         const keys = Object.keys(data);
         const obj = {} as typeof data;
         keys.sort((a, b) => {
            const regex = /^-?\d+\.?\d*$/;

            if (regex.test(a) && regex.test(b)) {
               return compare(Number(a), Number(b));
            }

            return compare(a, b);
         });

         for (const key of keys) {
            obj[key] = data[key];
         }

         for (const key in data) {
            delete data[key];
         }

         Object.assign(data, obj);
      }

      return data;
   }

   static baseName(path: string, suffix?: string): string {
      let b = path;
      const lastChar = b.charAt(b.length - 1);

      if (lastChar === '/' || lastChar === '\\') {
         b = b.slice(0, -1);
      }

      b = b.replace(/^.*[/\\]/g, '');

      if (typeof suffix === 'string' && b.substring(b.length - suffix.length) === suffix) {
         b = b.substring(0, b.length - suffix.length);
      }

      return b;
   }

   static dirName(path: string): string {
      return path.replace(/\\/g, '/').replace(/\/[^/]*\/?$/, '');
   }

   static async race<T>(callback: any, maxMiliseconds: number): Promise<T> {
      return <T>await Promise.race([
         Promise.resolve(Util.callAsync(null, callback)),
         new Promise((_resolve, reject) => {
            setTimeout(() => reject(new UtilRaceError('Race timeout.')), maxMiliseconds);
         }),
      ]);
   }

   static numberFormat(number: number, options?: NumberFormatOptions): string {
      if (isNaN(number)) {
         return 'NaN';
      }

      let numStr = number
         .toFixed(options?.decimals ?? 0)
         .replace('.', options?.decimalPoint ?? '.')
         .replace(/\B(?=(\d{3})+(?!\d))/g, options?.separator ?? ',');

      if (options?.prefix) {
         numStr = `${options.prefix}${numStr}`;
      }

      if (options?.suffix) {
         numStr = `${numStr}${options.suffix}`;
      }

      if (options?.pattern?.includes('{value}')) {
         numStr = options.pattern.replace('{value}', numStr);
      }

      return numStr;
   }

   static uFirst(str: string): string {
      return str.length > 1 ? `${str[0].toUpperCase()}${str.substring(1)}` : str;
   }

   static lFirst(str: string): string {
      return str.length > 1 ? `${str[0].toLowerCase()}${str.substring(1)}` : str;
   }

   static toCapitalize(str: string, ignoreNoneWord = false): string {
      const words = str.split(/\b/).map(Util.uFirst);

      if (ignoreNoneWord) {
         return words.filter((word) => !!word.trim() && !/\W/.test(word)).join('');
      }

      return words.join('');
   }

   static toCamelCase(str: string): string {
      return Util.lFirst(Util.toCapitalize(str, true));
   }

   static camelToSnackCase(str: string): string {
      const output: string[] = [];

      for (let i = 0, n = str.length; i < n; i++) {
         const char = str[i];
         output.push(char === char.toUpperCase() ? `_${char}` : char);
      }

      return output.join('').toLowerCase();
   }

   static snackToCamelCase(str: string): string {
      const output: string[] = [];
      let upperNext = false;

      for (let i = 0, n = str.length; i < n; i++) {
         const char = str[i];

         if (char === '_') {
            upperNext = true;
            continue;
         }

         if (upperNext) {
            upperNext = false;
            output.push(char.toUpperCase());
         } else {
            output.push(char.toLowerCase());
         }
      }

      if (output[0]) {
         output[0] = output[0].toLowerCase();
      }

      return output.join('');
   }

   static cloneObjectToCamelCase<TResult = ObjectRecord>(obj: ObjectRecord): TResult {
      if (!Is.object(obj)) {
         return obj;
      }

      const cloneObj: ObjectRecord = {};
      const clone = (data: ObjectRecord, target: ObjectRecord) => {
         for (const k in data) {
            const ck = Util.snackToCamelCase(k);

            if (Is.array(data[k]) || Is.object(data[k])) {
               target[ck] = Is.array(data[k]) ? [] : {};
               clone(data[k], target[ck]);
            } else {
               target[ck] = data[k];
            }
         }
      };

      clone(Util.clone(obj), cloneObj);

      return cloneObj;
   }

   static truncate(str: string, options?: { maxLength?: number; wordCount?: boolean; pad?: string }): string {
      const pad = options.pad || '...';
      const len = options.maxLength || 50;
      str = str.trim();

      if (options.wordCount === true) {
         const strs = str.split(/\s+/);
         const orgLen = strs.length;
         const copy = strs.slice(0, len);
         str = copy.join(' ');

         if (orgLen > copy.length) {
            str += pad;
         }
      } else {
         const orgLen = str.length;
         str = str.substring(0, len);

         if (orgLen > str.length) {
            str += pad;
         }
      }

      return str;
   }

   static repeat(char: string, level = 0): string {
      let output = char;
      level = parseInt(level.toString());

      if (level <= 0) {
         return '';
      }

      while (--level > 0) {
         output = `${output}${char}`;
      }

      return output;
   }
}
