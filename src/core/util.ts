'use strict';
import { Registry } from './registry';
import { DateTime } from './datetime';
import { Is } from './is';

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

   static resetObject<T extends object>(obj: object, newData?: T): T | {} {
      // Clean the object first
      for (const k in obj) {
         delete obj[k];
      }

      if (newData) {
         Object.assign(obj, newData);
      }

      return obj;
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

         Util.resetObject(data, obj);
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
}
