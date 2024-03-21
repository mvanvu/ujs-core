'use strict';
import { DateTime } from './datetime';
import { CommonType, ObjectCommonType } from '../type';
export type ObjectRulesOptions = { rules: ObjectCommonType; suitable?: boolean };
export class IsError extends Error {}
export class Is {
   static typeOf(value: any, type: CommonType, each = false): boolean {
      value = each ? (Array.isArray(value) ? value : [value]) : value;

      for (const val of each ? value : [value]) {
         const typeValue = typeof val;

         switch (type) {
            case 'string':
            case 'undefined':
            case 'boolean':
            case 'function':
            case 'symbol':
               if (typeValue !== type) {
                  return false;
               }

               break;

            case 'int':
            case 'sint':
            case 'uint':
               if (!Number.isInteger(val) || (type === 'sint' && val >= 0) || (type === 'uint' && val < 0)) {
                  return false;
               }

               break;

            case 'number':
            case 'snumber':
            case 'unumber':
               if (typeValue !== 'number' || !Number(val) || (type === 'snumber' && val >= 0) || (type === 'unumber' && val < 0)) {
                  return false;
               }

               break;

            case 'bigint':
            case 'sbigint':
            case 'ubigint':
               if (typeValue !== 'bigint' || (type === 'sbigint' && val >= 0) || (type === 'ubigint' && val < 0)) {
                  return false;
               }

               break;

            case 'object':
               if (!Is.object(val)) {
                  return false;
               }

               break;

            case 'array':
               if (!Array.isArray(val)) {
                  return false;
               }

               break;

            case 'null':
               if (val !== null) {
                  return false;
               }

               break;

            case 'NaN':
               if (!Number.isNaN(val)) {
                  return false;
               }

               break;

            case 'map':
               if (!(val instanceof Map)) {
                  return false;
               }

               break;

            case 'set':
               if (!(val instanceof Set)) {
                  return false;
               }

               break;

            case 'regex':
               if (!(val instanceof RegExp)) {
                  return false;
               }

               break;

            case 'date':
               if (!(val instanceof Date)) {
                  return false;
               }

               break;

            case 'datetime':
               if (!(val instanceof DateTime)) {
                  return false;
               }

               break;

            case 'datestring':
               if (typeValue !== 'string' || !DateTime.parse(val)) {
                  return false;
               }

               break;

            default:
               return false;
         }
      }

      return true;
   }

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

   static emptyObject(obj: any, each = false): boolean {
      if (each && Is.array(obj)) {
         for (const val of obj) {
            if (!Is.emptyObject(val)) {
               return false;
            }
         }

         return true;
      }

      return Is.object(obj) && !Object.keys(obj).length;
   }

   static date(d: any, each = false): boolean {
      return Is.typeOf(d, 'date', each);
   }

   static datetime(d: any, each = false): boolean {
      return Is.typeOf(d, 'datetime', each);
   }

   static dateString(d: any, each = false): boolean {
      return Is.typeOf(d, 'datestring', each);
   }

   static flatValue(value: any, each = false): boolean {
      if (each && Is.array(value)) {
         for (const val of value) {
            if (!Is.flatValue(val)) {
               return false;
            }
         }

         return true;
      }

      return value === null || ['string', 'number', 'bigint', 'boolean', 'symbol', 'undefined'].includes(typeof value);
   }

   static empty(value: any, each = false): boolean {
      if (each && Is.array(value)) {
         for (const val of value) {
            if (!Is.empty(val)) {
               return false;
            }
         }

         return true;
      }

      switch (typeof value) {
         case 'boolean':
            return value === false;

         case 'number':
         case 'bigint':
            return value === 0;

         case 'string':
            return !value.trim().length;
      }

      if (value instanceof Date || value instanceof DateTime) {
         return isNaN(+value);
      }

      if (value instanceof Map || value instanceof Set) {
         return !value.size;
      }

      if (Is.object(value)) {
         return !Object.keys(value).length;
      }

      if (Array.isArray(value) || Buffer.isBuffer(value)) {
         return !value.length;
      }

      return !Boolean(value);
   }

   static nothing(value: any): boolean {
      return [null, undefined, NaN].includes(value);
   }

   static object(value: any, options?: ObjectRulesOptions): boolean {
      const isObject = (o: any) => o !== null && !Array.isArray(o) && typeof o === 'object';

      if (!isObject(value)) {
         return false;
      }

      if (options) {
         const suitable = options.suitable ?? true;
         const validate = (v: any, rules?: any) => {
            if (isObject(rules)) {
               if (!isObject(v) || (suitable && !Is.equals(Object.keys(v).sort(), Object.keys(rules).sort()))) {
                  throw new IsError();
               }

               for (const key in rules) {
                  validate(v[key], rules[key]);
               }
            } else if (!Is.typeOf(v, rules)) {
               throw new IsError();
            }
         };

         try {
            validate(value, options?.rules);
         } catch {
            return false;
         }
      }

      return true;
   }

   static flatObject(value: any, allowArray?: boolean | { root?: boolean; deep?: boolean }): boolean {
      if (!Is.object(value)) {
         return false;
      }

      let rootArray = true;
      let deepArray = true;

      if (allowArray === false) {
         rootArray = deepArray = false;
      } else if (Is.object(allowArray)) {
         rootArray = allowArray['root'] !== false;
         deepArray = allowArray['deep'] !== false;
      }

      const deepCheck = (data: any) => {
         if (Array.isArray(data)) {
            if (!deepArray) {
               throw new Error();
            }

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
         } else if (Is.func(data)) {
            throw new Error();
         }
      };

      try {
         for (const k in value) {
            if (!rootArray && Array.isArray(value[k])) {
               throw new Error();
            }

            deepCheck(value[k]);
         }
      } catch {
         return false;
      }

      return true;
   }

   static objectOrArray(value: any): boolean {
      return Is.object(value) || Is.array(value);
   }

   static array(value: any, options?: { rules: CommonType | ObjectCommonType; suitable?: boolean; notEmpty?: boolean }): boolean {
      if (!Array.isArray(value) || (options?.notEmpty && !value.length)) {
         return false;
      }

      const rules = options?.rules;
      const suitable = options?.suitable;

      if (rules) {
         for (const val of value) {
            const isRulesObject = Is.object(rules);

            if ((isRulesObject && !Is.object(val, { rules: <ObjectCommonType>rules, suitable })) || (!isRulesObject && !Is.typeOf(val, <CommonType>rules))) {
               return false;
            }
         }
      }

      return true;
   }

   static asyncFunc(value: any, each = false): boolean {
      if (each && Is.array(value)) {
         for (const val of value) {
            if (!Is.asyncFunc(val)) {
               return false;
            }
         }

         return true;
      }

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return value instanceof (async () => {}).constructor;
   }

   static func(value: any, each = false): boolean {
      return Is.typeOf(value, 'function', each);
   }

   static callable(value: any, each = false): boolean {
      if (each && Is.array(value)) {
         for (const val of value) {
            if (!Is.callable(val)) {
               return false;
            }
         }

         return true;
      }

      return Is.func(value) || Is.asyncFunc(value) || value instanceof Promise;
   }

   static number(value: any, each = false): boolean {
      return Is.typeOf(value, 'number', each);
   }

   static sNumber(value: any, each = false): boolean {
      return Is.typeOf(value, 'snumber', each);
   }

   static uNumber(value: any, each = false): boolean {
      return Is.typeOf(value, 'unumber', each);
   }

   static int(value: any, each = false): boolean {
      return Is.typeOf(value, 'int', each);
   }

   static sInt(value: any, each = false): boolean {
      return Is.typeOf(value, 'sint', each);
   }

   static uInt(value: any, each = false): boolean {
      return Is.typeOf(value, 'uint', each);
   }

   static bigInt(value: any, each = false): boolean {
      return Is.typeOf(value, 'bigint', each);
   }

   static sBigInt(value: any, each = false): boolean {
      return Is.typeOf(value, 'sbigint', each);
   }

   static uBigInt(value: any, each = false): boolean {
      return Is.typeOf(value, 'ubigint', each);
   }

   static boolean(value: any, each = false): boolean {
      return Is.typeOf(value, 'boolean', each);
   }

   static string(value: any, each = false): boolean {
      return Is.typeOf(value, 'string', each);
   }

   static null(value: any, each = false): boolean {
      return Is.typeOf(value, 'null', each);
   }

   static undefined(value: any, each = false): boolean {
      return Is.typeOf(value, 'undefined', each);
   }

   static nan(value: any, each = false): boolean {
      return Is.typeOf(value, 'NaN', each);
   }

   static symbol(value: any, each = false): boolean {
      return Is.typeOf(value, 'symbol', each);
   }

   static map(value: any, each = false): boolean {
      return Is.typeOf(value, 'map', each);
   }

   static set(value: any, each = false): boolean {
      return Is.typeOf(value, 'set', each);
   }

   static regex(value: any, each = false): boolean {
      return Is.typeOf(value, 'regex', each);
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

   static nullOrUndefined(value: any, each = false): boolean {
      if (each && Is.array(value)) {
         for (const val of value) {
            if (!Is.nullOrUndefined(val)) {
               return false;
            }
         }

         return true;
      }

      return value === undefined || value === null;
   }

   static strongPassword(value: any, options?: { minLength?: number; noSpaces?: boolean }, each = false): boolean {
      if (each && Is.array(value)) {
         for (const val of value) {
            if (!Is.strongPassword(val, options)) {
               return false;
            }
         }

         return true;
      }

      if (typeof value !== 'string') {
         return false;
      }

      const minLength = options?.minLength ?? 8;
      const noSpaces = options?.noSpaces ?? true;

      if (noSpaces && value.match(/\s+/)) {
         return false;
      }

      return (
         value.length >= minLength && // Min length
         /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9\s])/g.test(value) // At less 1 lower char, 1 upper char, 1 digit and 1 special char
      );
   }
}
