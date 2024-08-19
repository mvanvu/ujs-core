'use strict';
import { DateTime } from './datetime';
import { ClassConstructor, CreditCardType, IsAsyncFunc, IsCallable, IsFunc, IsStringOptions, IsStrongPasswordOptions, ObjectRecord, Primitive } from '../type';

export class Is {
   static equals(a: any, b: any): boolean {
      if (a === b) {
         return true;
      }

      if ((a instanceof Date || a instanceof DateTime) && (b instanceof Date || b instanceof DateTime)) {
         return a.valueOf() === b.valueOf();
      }

      if (a !== null && b !== null && typeof a === 'object' && typeof b === 'object') {
         if (a.constructor !== b.constructor) {
            return false;
         }

         let length: number, i: number | IteratorResult<[any, any], any>;

         if (a.constructor === Array) {
            length = a.length;

            if (length !== b.length) {
               return false;
            }

            for (i = length; i-- !== 0; ) {
               if (Is.equals(a[i], b[i]) !== true) {
                  return false;
               }
            }

            return true;
         }

         if (a.constructor === Map) {
            if (a.size !== b.size) {
               return false;
            }

            let iter = a.entries();
            i = iter.next();
            while (i.done !== true) {
               if (b.has(i.value[0]) !== true) {
                  return false;
               }

               i = iter.next();
            }

            iter = a.entries();
            i = iter.next();

            while (i.done !== true) {
               if (Is.equals(i.value[1], b.get(i.value[0])) !== true) {
                  return false;
               }
               i = iter.next();
            }

            return true;
         }

         if (a.constructor === Set) {
            if (a.size !== b.size) {
               return false;
            }

            const iter = a.entries();
            i = iter.next();
            while (i.done !== true) {
               if (b.has(i.value[0]) !== true) {
                  return false;
               }
               i = iter.next();
            }

            return true;
         }

         if (a.buffer != null && a.buffer.constructor === ArrayBuffer) {
            length = a.length;

            if (length !== b.length) {
               return false;
            }

            for (i = length; i-- !== 0; ) {
               if (a[i] !== b[i]) {
                  return false;
               }
            }

            return true;
         }

         if (a.constructor === RegExp) {
            return a.source === b.source && a.flags === b.flags;
         }

         if (a.valueOf !== Object.prototype.valueOf) {
            return a.valueOf() === b.valueOf();
         }

         if (a.toString !== Object.prototype.toString) {
            return a.toString() === b.toString();
         }

         const keys = Object.keys(a).filter((key) => a[key] !== void 0);
         length = keys.length;

         if (length !== Object.keys(b).filter((key) => b[key] !== void 0).length) {
            return false;
         }

         for (i = length; i-- !== 0; ) {
            const key = keys[i];

            if (Is.equals(a[key], b[key]) !== true) {
               return false;
            }
         }

         return true;
      }

      // true if both NaN, false otherwise
      return a !== a && b !== b; // eslint-disable-line no-self-compare
   }

   static primitive(value: any): value is Primitive {
      return value === null || ['string', 'number', 'bigint', 'boolean', 'symbol', 'undefined'].includes(typeof value);
   }

   static empty(value: any): boolean {
      switch (typeof value) {
         case 'boolean':
            return value === false;

         case 'number':
         case 'bigint':
            return value === 0 || !value;

         case 'string':
            return !value.trim().length;
      }

      if (value instanceof Date || value instanceof DateTime) {
         return isNaN(+value);
      }

      if (value instanceof Map || value instanceof Set) {
         return !value.size;
      }

      if (value !== null && typeof value === 'object') {
         return !Object.keys(value).length;
      }

      if (Array.isArray(value) || Buffer.isBuffer(value)) {
         return !value.length;
      }

      return !Boolean(value);
   }

   static object(value: any): value is ObjectRecord {
      return value !== null && typeof value === 'object' && !Array.isArray(value);
   }

   static json(value: any): value is ObjectRecord | any[] {
      if (!Is.object(value) && !Is.array(value)) {
         return false;
      }

      const deepCheck = (data: any) => {
         if (Is.array(data)) {
            for (const datum of data) {
               deepCheck(datum);
            }
         } else if (Is.object(data)) {
            if (Object.prototype.toString.call(data) !== '[object Object]') {
               throw new Error();
            }

            for (const k in data) {
               deepCheck(data[k]);
            }
         } else if (data !== null && !['string', 'boolean', 'undefined', 'number'].includes(typeof data)) {
            throw new Error();
         }
      };

      try {
         deepCheck(value);

         return true;
      } catch {
         return false;
      }
   }

   static array(value: any): value is any[] {
      return Array.isArray(value);
   }

   static arrayUnique(value: any): value is any[] {
      if (!Array.isArray(value)) {
         return false;
      }

      const unique = [];

      for (const element of value) {
         if (Is.elementOf(element, unique)) {
            return false;
         }

         unique.push(element);
      }

      return true;
   }

   static asyncFunc(value: any): value is IsAsyncFunc {
      return value instanceof (async () => {}).constructor;
   }

   static func(value: any): value is IsFunc {
      return typeof value === 'function';
   }

   static callable(value: any): value is IsCallable {
      return Is.func(value) || Is.asyncFunc(value);
   }

   static number(value: any): value is number {
      return typeof value === 'number' && !isNaN(value);
   }

   static unsignedNumber(value: any): value is number {
      return Is.number(value) && value >= 0;
   }

   static integer(value: any): value is number {
      return Is.number(value) && Number.isInteger(value);
   }

   static unsignedInteger(value: any): value is number {
      return Is.integer(value) && value >= 0;
   }

   static boolean(value: any): value is boolean {
      return typeof value === 'boolean';
   }

   static stringFormat(value: any, format: IsStringOptions['format']): value is string {
      if (typeof value !== 'string') {
         return false;
      }

      try {
         switch (format) {
            case 'email':
               return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                  value,
               );

            case 'dateTime':
               return !!DateTime.parse(value);

            case 'date':
               return /^\d{4}-\d{2}-\d{2}$/.test(value) && !!DateTime.parse(value);

            case 'time':
               return /^\d{2}:\d{2}:\d{2}(\.\d{1,3})?$/.test(value) && !!DateTime.parse(`2024-08-05T${value}`);

            case 'creditCard':
               return Is.creditCard(value);

            case 'ipv4':
               return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
                  value,
               );

            case 'ipv6':
               return /^([0-9a-f]{1,4}:){6}|(:[0-9a-f]{1,4}){7}$/.test(value);

            case 'mongoId':
               return /^[0-9a-fA-F]{24}$/.test(value);

            case 'uri':
               return Boolean(new URL(value));

            case 'image':
               return Boolean(new URL(value)) && /\.(jpe?g|png|gif|svg|ico|bmp|webp|tiff)$/i.test(value);

            case 'base64':
               return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value);

            case 'md5':
               return /^[a-f0-9]{32}$/.test(value);

            case 'sha1':
               return /^[a-f0-9]{40}$/.test(value);

            case 'sha256':
               return /^[a-fA-F0-9]{64}$/.test(value);

            case 'uuid':
               return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(value);

            case 'jwt':
               return /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(value);

            case 'number':
               return /^-?[0-9]+(\.[0-9]+)?$/.test(value);

            case 'unsignedNumber':
               return /^[0-9]+(\.[0-9]+)?$/.test(value);

            case 'integer':
               return /^-?[0-9]+(\.[0]+)?$/.test(value);

            case 'unsignedInteger':
               return /^[0-9]+(\.[0]+)?$/.test(value);

            case 'boolean':
               return /true|false/i.test(value);

            case 'trim':
               return !/^\s+|\s+$/.test(value);

            case 'json':
               return ['{', '['].includes(value[0]) && typeof JSON.parse(value) === 'object';

            case 'alphanum':
               return /^[a-zA-Z0-9]+$/.test(value);

            case 'lowercase':
               return !/[A-Z]/.test(value);

            case 'uppercase':
               return !/[a-z]/.test(value);

            case 'binary':
               return /^[01]+$/.test(value);

            case 'slug':
               return /^[a-z0-9_\-]+$/i.test(value);

            case 'path':
               return /^[a-z0-9_\-/]+$/i.test(value) && !/^\/|\/$|\/\/+/.test(value);

            default:
               return format instanceof RegExp ? format.test(value) : false;
         }
      } catch {
         return false;
      }
   }

   static string(value: any): value is string {
      return typeof value === 'string';
   }

   static nodeJs(): boolean {
      return (
         typeof global !== 'undefined' &&
         global &&
         typeof global.process !== 'undefined' &&
         typeof global.process.versions !== 'undefined' &&
         typeof global.process.versions.node !== 'undefined'
      );
   }

   static strongPassword(value: any, options?: IsStrongPasswordOptions): value is string {
      const minLength = options?.minLength ?? 8;
      const minSpecialChars = options?.minSpecialChars ?? 1;
      const minUpper = options?.minUpper ?? 1;
      const minLower = options?.minLower ?? 1;
      const minNumber = options?.minNumber ?? 1;

      if (
         typeof value !== 'string' ||
         value.length < minLength ||
         (value.match(/[._-~`@#$%^&*()+=,]/g) || []).length < minSpecialChars ||
         (value.match(/[A-Z]/g) || []).length < minUpper ||
         (value.match(/[a-z]/g) || []).length < minLower ||
         (value.match(/[0-9]/g) || []).length < minNumber
      ) {
         return false;
      }

      return true;
   }

   static elementOf(value: any, array: any[]): boolean {
      return array.findIndex((element) => Is.equals(value, element)) !== -1;
   }

   static includes(value: any, target: any): boolean {
      if (Is.string(value)) {
         return Is.string(target) ? value.includes(target) : false;
      }

      if (Is.array(value)) {
         return Is.elementOf(target, value);
      }

      if (Is.object(value) && (Is.object(target) || Is.string(target))) {
         if (Is.string(target)) {
            const paths = target.split('.');
            let o = value;

            for (let i = 0, n = paths.length; i < n; i++) {
               const prop = paths[i];

               if (!Is.object(o) || !o.hasOwnProperty(prop)) {
                  return false;
               }

               o = o[prop];
            }
         } else {
            for (const key in target) {
               if (!value.hasOwnProperty(key) || !Is.equals(value[key], target[key])) {
                  return false;
               }
            }
         }

         return true;
      }

      return Is.equals(value, target);
   }

   static class(value: any): value is ClassConstructor<any> {
      return Is.func(value) && value.toString()?.startsWith('class ');
   }

   static creditCard(value: string, type?: CreditCardType): boolean {
      const amex = new RegExp('^3[47][0-9]{13}$').test(value);
      const visa = new RegExp('^4[0-9]{12}(?:[0-9]{3})?$').test(value);
      const cup1 = new RegExp('^62[0-9]{14}[0-9]*$').test(value);
      const cup2 = new RegExp('^81[0-9]{14}[0-9]*$').test(value);
      const mastercard = new RegExp('^5[1-5][0-9]{14}$').test(value);
      const mastercard2 = new RegExp('^2[2-7][0-9]{14}$').test(value);
      const disco1 = new RegExp('^6011[0-9]{12}[0-9]*$').test(value);
      const disco2 = new RegExp('^62[24568][0-9]{13}[0-9]*$').test(value);
      const disco3 = new RegExp('^6[45][0-9]{14}[0-9]*$').test(value);
      const diners = new RegExp('^3[0689][0-9]{12}[0-9]*$').test(value);
      const jcb = new RegExp('^35[0-9]{14}[0-9]*$').test(value);

      if (type) {
         switch (type) {
            case 'VISA':
               return visa;

            case 'AMEX':
               return amex;

            case 'MASTERCARD':
               return mastercard || mastercard2;

            case 'DISCOVER':
               return disco1 || disco2 || disco3;

            case 'DINERS':
               return diners;

            case 'JCB':
               return jcb;

            case 'CHINA_UNION_PAY':
               return cup1 || cup2;
         }
      }

      return amex || visa || cup1 || cup2 || mastercard || mastercard2 || disco1 || disco2 || disco3 || diners || jcb;
   }
}
