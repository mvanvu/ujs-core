'use strict';
import { Registry } from './registry';
import { DateTime } from './datetime';
import { Is } from './is';

export class UtilRaceError extends Error {}
export class Util {
   static clone<T>(src: T): T {
      let newInst: any = src;

      if (Is.flatValue(newInst)) {
         return newInst;
      }

      if (src instanceof DateTime || src instanceof Registry) {
         newInst = src.clone();
      } else if (src instanceof Date) {
         newInst = new Date(src);
      } else if (src instanceof RegExp) {
         newInst = new RegExp(src.source, src.flags);
      } else if (src instanceof Set) {
         newInst = new Set();
         src.forEach((val) => newInst.add(Util.clone(val)));
      } else if (src instanceof Map) {
         newInst = new Map();
         src.forEach((val) => newInst.set(Util.clone(val)));
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

   static async callback<T>(fn: any, params: any[] = [], inst?: any): Promise<T> {
      return Is.asyncFunc(fn) ? await fn.apply(inst, params) : fn instanceof Promise ? await fn : Is.func(fn) ? fn.apply(inst, params) : fn;
   }

   static sort(data: any[] | object, options?: { key?: string }) {
      const k = options?.key;
      const compare = (a: any, b: any) => (a < b ? -1 : a > b ? 1 : 0);

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
         keys.sort();

         for (const key of keys) {
            obj[key] = Util.clone(data[key]);
         }

         for (const key in data) {
            delete data[key];
         }

         Object.assign(data, obj);
      }

      return data;
   }

   static baseName(path: string, suffix?: string) {
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

   static dirName(path: string) {
      return path.replace(/\\/g, '/').replace(/\/[^/]*\/?$/, '');
   }

   static async race(callback: any, maxSeconds: number) {
      return await Promise.race([
         Promise.resolve(Util.callback(callback)),
         new Promise((_resolve, reject) => {
            setTimeout(() => reject(new UtilRaceError('Race timeout.')), maxSeconds * 1000);
         }),
      ]);
   }

   static debug(...entries: any[]) {
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

   static debugDev(...entries: any[]) {
      if (Is.nodeJs() && process?.env?.NODE_ENV === 'development') {
         Util.debug(...entries);
      }
   }
}
