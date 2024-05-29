'use strict';
import { Is } from './is';
import { NumberFormatOptions, ObjectRecord } from '../type';

export class UtilRaceError extends Error {}
export class Util {
   static clone<T>(src: T): T {
      let newInst: any = src;

      if (Is.primitive(newInst)) {
         return newInst;
      }

      if (Is.object(src) && Is.func(src['clone'])) {
         newInst = (src as any).clone();
      } else if (src instanceof Date) {
         newInst = new Date(src);
      } else if (src instanceof RegExp) {
         newInst = new RegExp(src.source, src.flags);
      } else if (src instanceof Set) {
         newInst = new Set();
         src.forEach((val) => newInst.add(Util.clone(val)));
      } else if (src instanceof Map) {
         newInst = new Map();
         src.forEach((val, key) => newInst.set(key, Util.clone(val)));
      } else if (Array.isArray(src)) {
         newInst = [];
         src.forEach((val) => newInst.push(Util.clone(val)));
      } else if (Is.object(src)) {
         newInst = {};
         Object.assign(newInst, ...Object.keys(src).map((key) => ({ [key]: Util.clone(src[key]) })));
      } else if (typeof src?.constructor === 'function') {
         const val = typeof src.valueOf === 'function' ? src.valueOf() : undefined;

         if (val && Object(val) !== val) {
            newInst = new (src.constructor as any)(val);
         }
      }

      return newInst;
   }

   /** @deprecated use call() instead */
   static async callback<T>(fn: any, params: any[] = [], inst?: any): Promise<T> {
      return Is.asyncFunc(fn) ? await fn.apply(inst, params) : fn instanceof Promise ? await fn : Is.func(fn) ? fn.apply(inst, params) : fn;
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
         Promise.resolve(Util.callback(callback)),
         new Promise((_resolve, reject) => {
            setTimeout(() => reject(new UtilRaceError('Race timeout.')), maxMiliseconds);
         }),
      ]);
   }

   static debug(...entries: any[]): void {
      const colors = {
         object: '\u001b[35m', // Magenta for objects
         prop: '\u001b[36m', // Cyan for properties
         array: '\u001b[35m', // Magenta for arrays
         string: '\u001b[37m', // White for strings
         number: '\u001b[33m', // Yellow for numbers
         boolean: '\u001b[34m', // Blue for booleans
         null: '\u001b[34m', // Blue for null,
         reset: '\u001b[0m',
      };
      const paintChar = (str: string, color: string) => `${color}${str}${colors.reset}`;
      const dump = (entry: any, depth: number) => {
         if (entry instanceof Error) {
            return console.debug(entry);
         }

         let str = '';

         if (Is.object(entry)) {
            str += paintChar('{', colors.object) + '\n';

            for (const key in entry) {
               if (Object.prototype.hasOwnProperty.call(entry, key)) {
                  str += '  '.repeat(depth + 1) + paintChar(key, colors.prop) + ': ';
                  str += dump(entry[key], depth + 1);
                  str += ',\n';
               }
            }

            str = str.slice(0, -2) + '\n' + '  '.repeat(depth) + paintChar('}', colors.object);
         } else if (Is.array(entry)) {
            str += paintChar('[', colors.array);

            for (let i = 0; i < entry.length; i++) {
               if (i > 0) {
                  str += ', ';
               }

               str += dump(entry[i], depth + 1);
            }

            str += paintChar(']', colors.array);
         } else if (Is.string(entry)) {
            str += `${colors.string}${JSON.stringify(entry)}`;
         } else if (Is.number(entry)) {
            str += `${colors.number}${entry}`;
         } else if (Is.boolean(entry)) {
            str += `${colors.boolean}${entry}`;
         } else if (Is.null(entry)) {
            str += `${colors.null}null`;
         } else {
            str += entry;
         }

         return str + colors.reset;
      };

      console.log(...entries.map((entry) => dump(entry, 0)));
   }

   static debugDev(...entries: any[]): void {
      if (Is.nodeJs() && process?.env?.NODE_ENV === 'development') {
         Util.debug(...entries);
      }
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
