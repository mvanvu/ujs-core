'use strict';
import { configDefault } from '../config';
import { Registry } from './registry';
import { DateTime } from './datetime';
import { Is } from './is';
import * as crypto from 'crypto';

export function clone<T extends any>(src: T): T {
   if (Is.flatValue(src)) {
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

export function extendsObject<T extends Record<string, any>>(
   target: T | Record<string, any>,
   ...sources: Record<string, any>[]
): T {
   for (const source of sources) {
      for (const key in source) {
         const data = source[key];

         if (Is.object(target[key]) && Is.object(data)) {
            extendsObject(target[key], data);
         } else {
            Object.assign(target, { [key]: Is.flatValue(data) ? data : clone(data) });
         }
      }
   }

   return <T>target;
}

export function excludeProps<T extends Record<string, any>, K extends keyof T>(obj: T, props: K[] | K): Omit<T, K> {
   for (const prop of Array.isArray(props) ? props : [props]) {
      delete obj[prop];
   }

   return obj;
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

export function camelToSnackCase(str: string) {
   const output: string[] = [];

   for (let i = 0, n = str.length; i < n; i++) {
      const char = str[i];
      output.push(char === char.toUpperCase() ? `_${char}` : char);
   }

   return output.join('');
}

export function snackToCamelCase(str: string) {
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

export function uFirst(str: string) {
   return str.length > 1 ? `${str[0].toUpperCase()}${str.substring(1)}` : str;
}

export function lFirst(str: string) {
   return str.length > 1 ? `${str[0].toLowerCase()}${str.substring(1)}` : str;
}

export function toCapitalize(str: string) {
   return str
      .split(/[^a-z0-9]/i)
      .map((word) => uFirst(word))
      .filter((word) => !!word.trim())
      .join('');
}

export function toCamelCase(str: string) {
   return lFirst(toCapitalize(str));
}

export function debug(...args: any[]) {
   if (configDefault.mode === 'development') {
      console.debug(...args);
   }
}

export function hash(str: string, type: 'md5' | 'sha1' | 'sha256' = 'sha256') {
   return crypto.createHash(type).update(str).digest('hex');
}

export function uuid() {
   let buf: Buffer | undefined,
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
      buf = crypto.randomBytes(BUFFER_SIZE);
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

export function sum(source: number[] | Record<string, any>[], options?: { key?: string }) {
   const key = options?.key ?? '';
   let sum = 0;

   for (const rec of source) {
      if (typeof rec === 'number') {
         sum += rec;
      } else if (typeof rec === 'object' && typeof rec[key] === 'number') {
         sum += Number(rec[key]) || 0;
      }
   }

   return sum;
}

export function truncate(str: string, maxLength = 50, pad = '...') {
   str = str.trim();
   const len = str.length;
   str = str.substring(0, maxLength);

   if (len > str.length) {
      str += pad;
   }

   return str;
}

export function union(...elements: any[]) {
   const uniqueArray = [];
   const push = (array: any[]) => {
      for (const element of array) {
         if (Array.isArray(element)) {
            push(element);
         } else if (!uniqueArray.find((arr) => Is.equals(arr, element))) {
            uniqueArray.push(element);
         }
      }
   };
   push(elements);

   return uniqueArray;
}

export function first<T extends any>(array: T[]): T | undefined {
   return array.length ? array[0] : undefined;
}

export function last<T extends any>(array: T[]): T | undefined {
   return array.length ? array[array.length - 1] : undefined;
}

export function chunk<T extends any>(array: T[], size = 1): Array<T[]> {
   const output = [];
   let index = 0;

   for (let i = 0, n = array.length; i < n; i++) {
      let chunk = output[index];

      if (chunk && chunk.length >= size) {
         chunk = output[++index];
      }

      if (!chunk) {
         output.push((chunk = []));
      }

      chunk.push(array[i]);
   }

   return output;
}

export function repeat(char: string, level = 0) {
   level = parseInt(level.toString());

   if (level <= 0) {
      return '';
   }

   while (--level > 0) {
      char += `${char}`;
   }

   return char;
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
