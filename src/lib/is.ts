'use strict';
import { DateTime } from './datetime';
import { CommonType, IsEqual, ObjectCommonType } from '../type';
export type ObjectRulesOptions = { rules: ObjectCommonType; suitable?: boolean };

export type ArrayRulesOptions = { rules: CommonType | ObjectCommonType; suitable?: boolean; notEmpty?: boolean };

export type ObjectArrayRulesOptions = {
   object?: ObjectRulesOptions; // For type Is.object only
   array?: ArrayRulesOptions; // For type Is.array only
};

export type EqualsRulesOptions = {
   equalsTo: any;
};

export type StrongPasswordOptions = {
   minLength?: number;
   noSpaces?: boolean;
   minSpecialChars?: number;
   minUpper?: number;
   minLower?: number;
   minNumber?: number;
};

export type FlatObjectRulesOptions = {
   allowArray?: boolean | { root?: boolean; deep?: boolean };
};

export type IsValidType<T = keyof typeof Is> = T extends 'typeOf' | 'prototype' | 'flatValue' | 'nodeJs' | 'valid' ? never : T;

export type IsValidOptions<T> = {
   type: T;
   each?: boolean;
   meta?: IsEqual<T, 'object'> extends true
      ? ObjectRulesOptions
      : IsEqual<T, 'array'> extends true
        ? ArrayRulesOptions
        : IsEqual<T, 'objectOrArray'> extends true
          ? ObjectArrayRulesOptions
          : IsEqual<T, 'equals'> extends true
            ? EqualsRulesOptions
            : IsEqual<T, 'flatObject'> extends true
              ? FlatObjectRulesOptions
              : IsEqual<T, 'strongPassword'> extends true
                ? StrongPasswordOptions
                : IsEqual<T, 'inArray'> extends true
                  ? any[]
                  : undefined;
};

export class IsError extends Error {}
export class Is {
   static typeOf(value: any, type: CommonType, each = false): boolean {
      if (each) {
         if (!Array.isArray(value)) {
            return false;
         }

         for (const val of value) {
            if (!Is.typeOf(val, type, false)) {
               return false;
            }
         }

         return true;
      }

      const typeValue = typeof value;

      switch (type) {
         case 'string':
         case 'undefined':
         case 'boolean':
         case 'function':
         case 'symbol':
            return typeValue === type;

         case 'int':
         case 'sint':
         case 'uint':
            return !Number.isInteger(value) || (type === 'sint' && value >= 0) || (type === 'uint' && value < 0) ? false : true;

         case 'number':
         case 'snumber':
         case 'unumber':
            return typeValue !== 'number' || !Number(value) || (type === 'snumber' && value >= 0) || (type === 'unumber' && value < 0) ? false : true;

         case 'bigint':
         case 'sbigint':
         case 'ubigint':
            return typeValue !== 'bigint' || (type === 'sbigint' && value >= 0) || (type === 'ubigint' && value < 0) ? false : true;

         case 'object':
            return Is.object(value);

         case 'array':
            return Array.isArray(value);

         case 'null':
            return value === null;

         case 'NaN':
            return Number.isNaN(value);

         case 'map':
            return value instanceof Map;

         case 'set':
            return value instanceof Set;

         case 'regex':
            return value instanceof RegExp;

         case 'date':
            return value instanceof Date;

         case 'datetime':
            return value instanceof DateTime;

         case 'datestring':
            return typeValue === 'string' && !!DateTime.parse(value);

         case 'primitive':
            return Is.primitive(value);

         default:
            return false;
      }
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

   /** @deprecated Use Is.primitive instead */
   static flatValue(value: any, each = false): boolean {
      return Is.primitive(value, each);
   }

   static primitive(value: any, each = false): boolean {
      if (each && Is.array(value)) {
         for (const val of value) {
            if (!Is.primitive(val)) {
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

   static nothing(value: any, each?: boolean): boolean {
      if (each && Is.array(value)) {
         for (const val of value) {
            if (!Is.nothing(val)) {
               return false;
            }
         }

         return true;
      }

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

   static flatObject(value: any, allowArray?: FlatObjectRulesOptions['allowArray']): boolean {
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

   static objectOrArray<T>(value: T): boolean {
      return Is.object(value) || Is.array(value);
   }

   static array(value: any, options?: ArrayRulesOptions): boolean {
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

      return Is.func(value) || Is.asyncFunc(value);
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

   static strongPassword(value: any, options?: StrongPasswordOptions, each = false): boolean {
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
      const minSpecialChars = options?.minSpecialChars ?? 1;
      const minUpper = options?.minUpper ?? 1;
      const minLower = options?.minLower ?? 1;
      const minNumber = options?.minNumber ?? 1;

      if (
         value.length < minLength ||
         (noSpaces && value.match(/\s+/)) ||
         (value.match(/[._-~`@#$%^&*()+=,]/g) || []).length < minSpecialChars ||
         (value.match(/[A-Z]/g) || []).length < minUpper ||
         (value.match(/[a-z]/g) || []).length < minLower ||
         (value.match(/[0-9]/g) || []).length < minNumber
      ) {
         return false;
      }

      return true;
   }

   static promise(value: any, each = false): boolean {
      if (each) {
         if (!Array.isArray(value)) {
            return false;
         }

         for (const val of value) {
            if (!Is.promise(val)) {
               return false;
            }
         }

         return true;
      }

      return value !== null && typeof value === 'object' && typeof value.then === 'function';
   }

   static email(value: any, each = false): boolean {
      if (each) {
         if (!Array.isArray(value)) {
            return false;
         }

         for (const e of value) {
            if (!Is.email(e)) {
               return false;
            }
         }

         return true;
      }

      return typeof value === 'string' && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value);
   }

   static inArray(value: any, array: any[], each = false): boolean {
      if (each) {
         if (!Array.isArray(value)) {
            return false;
         }

         for (const val of value) {
            if (!Is.inArray(val, array)) {
               return false;
            }
         }

         return true;
      }

      return array.includes(value);
   }

   static valid<T extends IsValidType>(value: any, options: IsValidOptions<T>): boolean {
      const { type: method } = options;
      const invalidMethods = ['typeOf', 'prototype', 'flatValue', 'nodeJs', 'valid'];

      if (invalidMethods.includes(method) || !Is.callable(Is[method])) {
         return false;
      }

      const each: boolean = options.each === true;

      if (each) {
         if (!Array.isArray(value)) {
            return false;
         }

         for (const val of value) {
            if (!Is.valid(val, { type: method, each: false, meta: options.meta })) {
               return false;
            }
         }

         return true;
      }

      switch (method) {
         case 'object':
            return Is.object(value, options.meta as ObjectRulesOptions);

         case 'array':
            return Is.array(value, options.meta as ArrayRulesOptions);

         case 'objectOrArray':
            if (!Is.objectOrArray(value)) {
               return false;
            }

            if (Array.isArray(value)) {
               return Is.array(value, (options.meta as ObjectArrayRulesOptions)?.array);
            }

            return Is.object(value, (options.meta as ObjectArrayRulesOptions)?.object);

         case 'equals':
            const { equalsTo } = (options.meta as EqualsRulesOptions) ?? {};

            return equalsTo === undefined ? false : Is.equals(value, equalsTo);

         case 'flatObject':
            const { allowArray } = (options.meta as FlatObjectRulesOptions) ?? {};

            return Is.flatObject(value, allowArray);

         case 'strongPassword':
            return Is.strongPassword(value, options.meta as StrongPasswordOptions);

         case 'inArray':
            return Is.inArray(value, options.meta as any[], options.each);

         default:
            return Is[method].call(null, value, false);
      }
   }
}
