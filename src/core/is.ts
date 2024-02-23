'use strict';
import { DateTime } from './datetime';
import { CommonType, ObjectCommonType } from '../type';
type RulesOptions = { rules: ObjectCommonType; suitable?: boolean };

export class Is {
   static typeOf(value: any, type: CommonType, each = false) {
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
               if (!Number.isInteger(val) || (type === 'sint' && val < 0) || (type === 'uint' && val >= 0)) {
                  return false;
               }

               break;

            case 'number':
            case 'snumber':
            case 'unumber':
               if (!Number(val) || (type === 'snumber' && val < 0) || (type === 'unumber' && val >= 0)) {
                  return false;
               }

               break;

            case 'bigint':
            case 'sbigint':
            case 'ubigint':
               if (typeValue !== 'bigint' || (type === 'sbigint' && val < 0) || (type === 'ubigint' && val >= 0)) {
                  return false;
               }

               break;

            case 'object':
               if (!val || Array.isArray(val) || typeValue !== 'object') {
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
               if (!Is.date(val)) {
                  return false;
               }

               break;

            default:
               return false;
         }
      }

      return true;
   }

   static equals(a: any, b: any) {
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

   static emptyObject(obj: any) {
      return Is.object(obj) && !Object.keys(obj).length;
   }

   static date(d: any): DateTime | false {
      const date = DateTime.from(d);

      return date.valid ? date : false;
   }

   static flat(value: any) {
      return (typeof value !== 'object' && typeof value !== 'function') || value === null;
   }

   static empty(value: any) {
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

   static nothing(value: any) {
      return [null, undefined, NaN].includes(value);
   }

   static object(value: any) {
      return value !== null && !Array.isArray(value) && typeof value === 'object';
   }

   static objectOrArray(value: any) {
      return Is.object(value) || Is.array(value);
   }

   private static validateObject(value: any, options?: RulesOptions) {
      const suitable = options?.suitable ?? true;
      const validate = (v: any, rules?: any) => {
         if (!Is.object(v)) {
            throw false;
         }

         rules = rules ?? options?.rules;

         if (Is.object(rules)) {
            if (suitable) {
               for (const key in v) {
                  if (!rules.hasOwnProperty(key)) {
                     throw false;
                  }
               }
            }

            for (const key in rules) {
               const isRuleObject = Is.object(rules[key]);

               if (isRuleObject) {
                  validate(v[key], rules[key]);
               } else if (!v.hasOwnProperty(key) || !Is.typeOf(v[key], rules[key])) {
                  throw false;
               }
            }
         }
      };

      validate(value);
   }

   static record(value: any, options?: RulesOptions) {
      try {
         Is.validateObject(value, options);
      } catch {
         return false;
      }

      return true;
   }

   static array(value: any, options?: { rules: CommonType | ObjectCommonType; suitable?: boolean; notEmpty?: boolean }) {
      if (!Array.isArray(value) || (options?.notEmpty && !value.length)) {
         return false;
      }

      const rules = options?.rules;

      if (rules) {
         for (const val of value) {
            if (Is.object(rules)) {
               try {
                  Is.validateObject(val, { rules: <ObjectCommonType>rules, suitable: options?.suitable });
               } catch {
                  return false;
               }
            } else if (!Is.typeOf(val, <CommonType>rules)) {
               return false;
            }
         }
      }

      return true;
   }

   // eslint-disable-next-line @typescript-eslint/no-empty-function
   static asyncFunc(value: any) {
      return value instanceof Promise || value instanceof (async () => {}).constructor;
   }

   static func(value: any, each = false) {
      return Is.typeOf(value, 'function', each);
   }

   static number(value: any, each = false) {
      return Is.typeOf(value, 'number', each);
   }

   static sNumber(value: any, each = false) {
      return Is.typeOf(value, 'snumber', each);
   }

   static uNumber(value: any, each = false) {
      return Is.typeOf(value, 'unumber', each);
   }

   static int(value: any, each = false) {
      return Is.typeOf(value, 'int', each);
   }

   static sInt(value: any, each = false) {
      return Is.typeOf(value, 'sint', each);
   }

   static uInt(value: any, each = false) {
      return Is.typeOf(value, 'uint', each);
   }

   static bigInt(value: any, each = false) {
      return Is.typeOf(value, 'bigint', each);
   }

   static sBigInt(value: any, each = false) {
      return Is.typeOf(value, 'sbigint', each);
   }

   static uBigInt(value: any, each = false) {
      return Is.typeOf(value, 'ubigint', each);
   }

   static boolean(value: any, each = false) {
      return Is.typeOf(value, 'boolean', each);
   }

   static string(value: any, each = false) {
      return Is.typeOf(value, 'string', each);
   }

   static null(value: any, each = false) {
      return Is.typeOf(value, 'null', each);
   }

   static undefined(value: any, each = false) {
      return Is.typeOf(value, 'undefined', each);
   }

   static nan(value: any, each = false) {
      return Is.typeOf(value, 'NaN', each);
   }

   static symbol(value: any, each = false) {
      return Is.typeOf(value, 'symbol', each);
   }

   static map(value: any, each = false) {
      return Is.typeOf(value, 'map', each);
   }

   static set(value: any, each = false) {
      return Is.typeOf(value, 'set', each);
   }

   static regex(value: any, each = false) {
      return Is.typeOf(value, 'regex', each);
   }

   static nodeJs() {
      return (
         typeof global !== 'undefined' &&
         global &&
         typeof global.process !== 'undefined' &&
         typeof global.process.versions !== 'undefined' &&
         typeof global.process.versions.node !== 'undefined'
      );
   }

   static nullOrUndefined(value: any) {
      return value === undefined || value === null;
   }

   static strongPassword(value: string, options?: { minLength?: number; noSpaces?: boolean }) {
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