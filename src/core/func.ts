'use strict';
import { Registry } from './registry';
import { DateTime } from './datetime';
import { Is } from './is';

export function clone<T extends any>(src: T): T {
   if (Is.flat(src)) {
      return <T>src;
   }

   let newInst: any;

   if (src instanceof DateTime || src instanceof Registry) {
      newInst = src.clone();
   } else if (src instanceof Date) {
      newInst = new Date(src);
   } else if (src instanceof RegExp) {
      newInst = new RegExp(src.source, src.flags);
   } else if (src instanceof Set) {
      newInst = new Set();
      src.forEach((val) => newInst.add(clone(val)));
   } else if (src instanceof Map) {
      newInst = new Map();
      src.forEach((val) => newInst.set(clone(val)));
   } else if (Array.isArray(src)) {
      newInst = [];
      src.forEach((val) => newInst.push(clone(val)));
   } else if (Is.object(src)) {
      newInst = {};
      Object.assign(newInst, ...Object.keys(src).map((key) => ({ [key]: clone(src[key]) })));
   } else if (typeof src?.constructor === 'function') {
      const val = typeof src.valueOf === 'function' ? src.valueOf() : undefined;

      if (val && Object(val) !== val) {
         newInst = new (src.constructor as any)(val);
      }
   }

   return <T>newInst;
}

export async function callback<T extends Promise<T>>(fn: any, params: any[] = [], inst?: any) {
   if (fn instanceof Promise) {
      return <T>await fn;
   }

   if (typeof fn === 'function') {
      return Is.asyncFunc(fn) ? <T>await fn.apply(inst, params) : <T>fn.apply(inst, params);
   }

   return <T>fn;
}

export function resetObject<T extends object>(obj: object, newData?: T): T | {} {
   // Clean the object first
   for (const k in obj) {
      delete obj[k];
   }

   if (newData) {
      Object.assign(obj, newData);
   }

   return obj;
}

export function sort(data: any[] | object, options?: { key?: string }) {
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
         obj[key] = clone(data[key]);
      }

      resetObject(data, obj);
   }

   return data;
}

export function baseName(path: string, suffix?: string) {
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

export function dirName(path: string) {
   return path.replace(/\\/g, '/').replace(/\/[^/]*\/?$/, '');
}
