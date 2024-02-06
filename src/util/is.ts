'use strict';
import { DateTime } from './datetime';
import { CommonType, ObjectCommonType } from '../type';
type RulesOptions = { rules: ObjectCommonType; suitable?: boolean };

export class Is {
   static emptyObject(obj: any) {
      return Is.object(obj) && !Object.keys(obj).length;
   }

   static date(d: any): DateTime | false {
      const date = DateTime.create(d);

      return date.valid ? date : false;
   }

   // eslint-disable-next-line @typescript-eslint/no-empty-function
   static asyncFunc(fn: any) {
      return fn instanceof (async () => {}).constructor;
   }

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

   static flatValue(value: any) {
      if ([null, undefined, NaN].includes(value)) {
         return true;
      }

      const flatTypes: CommonType[] = ['string', 'boolean', 'number', 'bigint', 'ubigint', 'int', 'uint', 'number', 'unumber'];

      for (const flatType of flatTypes) {
         if (Is.typeOf(value, flatType)) {
            return true;
         }
      }

      return false;
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

   static validateObject(value: any, options?: RulesOptions) {
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
}
