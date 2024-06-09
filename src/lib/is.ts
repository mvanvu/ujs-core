'use strict';
import { DateTime } from './datetime';
import {
   ArrayRulesOptions,
   ClassConstructor,
   CommonType,
   CreditCardType,
   EqualsRulesOptions,
   FlatObjectRulesOptions,
   IsError,
   IsValidOptions,
   ObjectArrayRulesOptions,
   ObjectCommonType,
   ObjectRecord,
   ObjectRulesOptions,
   ReturnIsBigInt,
   ReturnIsNull,
   ReturnIsNumber,
   ReturnIsPrimitive,
   ReturnIsString,
   ReturnIsSymbol,
   ReturnIsUndefined,
   StrongPasswordOptions,
} from '../type';
export type IsValidType<T = keyof typeof Is> = T extends 'typeOf' | 'prototype' | 'nodeJs' | 'valid' | 'each' ? never : T;

export class Is {
   static typeOf(value: any, type: CommonType, each?: boolean): boolean {
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

   static emptyObject<E extends boolean = false, R = E extends true ? {}[] : {}>(value: any, each?: E): value is R {
      return Is.each(each, value, (item: any) => Is.object(item) && !Object.keys(item).length);
   }

   static date<E extends boolean = false, R = E extends true ? Date[] : Date>(value: any, each?: E): value is R {
      return Is.typeOf(value, 'date', each);
   }

   static datetime<E extends boolean = false, R = E extends true ? DateTime[] : DateTime>(value: any, each?: boolean): value is R {
      return Is.typeOf(value, 'datetime', each);
   }

   static dateString<E extends boolean = false>(d: any, each?: E): d is ReturnIsString<E> {
      return Is.typeOf(d, 'datestring', each);
   }

   static primitive<E extends boolean = false>(value: any, each?: E): value is ReturnIsPrimitive<E> {
      return Is.each(each, value, (item: any) => item === null || ['string', 'number', 'bigint', 'boolean', 'symbol', 'undefined'].includes(typeof item));
   }

   static empty(value: any, each?: boolean): boolean {
      return Is.each(each, value, (item: any) => {
         switch (typeof item) {
            case 'boolean':
               return item === false;

            case 'number':
            case 'bigint':
               return item === 0;

            case 'string':
               return !item.trim().length;
         }

         if (item instanceof Date || item instanceof DateTime) {
            return isNaN(+item);
         }

         if (item instanceof Map || item instanceof Set) {
            return !item.size;
         }

         if (Is.object(item)) {
            return !Object.keys(item).length;
         }

         if (Array.isArray(item) || Buffer.isBuffer(item)) {
            return !item.length;
         }

         return !Boolean(item);
      });
   }

   static nothing(value: any, each?: boolean): value is (null | undefined | typeof NaN)[] {
      return Is.each(each, value, (item: any) => [null, undefined, NaN].includes(item));
   }

   static object(value: any, options?: ObjectRulesOptions): value is ObjectRecord {
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

   static flatObject(value: any, allowArray?: FlatObjectRulesOptions['allowArray']): value is ObjectRecord {
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

   static objectOrArray(value: any): value is ObjectRecord | any[] {
      return Is.object(value) || Is.array(value);
   }

   static array(value: any, options?: ArrayRulesOptions): value is any[] {
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

   static asyncFunc(value: any, each?: boolean): boolean {
      return Is.each(each, value, (item: any) => item instanceof (async () => {}).constructor);
   }

   static func(value: any, each?: boolean): boolean {
      return Is.typeOf(value, 'function', each);
   }

   static callable(value: any, each?: boolean): boolean {
      return Is.each(each, value, (item: any) => Is.func(item) || Is.asyncFunc(item));
   }

   static number<E extends boolean = false>(value: any, each?: E): value is ReturnIsNumber<E> {
      return Is.typeOf(value, 'number', each);
   }

   static sNumber<E extends boolean = false>(value: any, each?: boolean): value is ReturnIsNumber<E> {
      return Is.typeOf(value, 'snumber', each);
   }

   static uNumber<E extends boolean = false>(value: any, each?: boolean): value is ReturnIsNumber<E> {
      return Is.typeOf(value, 'unumber', each);
   }

   static int<E extends boolean = false>(value: any, each?: boolean): value is ReturnIsNumber<E> {
      return Is.typeOf(value, 'int', each);
   }

   static sInt<E extends boolean = false>(value: any, each?: boolean): value is ReturnIsNumber<E> {
      return Is.typeOf(value, 'sint', each);
   }

   static uInt<E extends boolean = false>(value: any, each?: boolean): value is ReturnIsNumber<E> {
      return Is.typeOf(value, 'uint', each);
   }

   static bigInt<E extends boolean = false>(value: any, each?: E): value is ReturnIsBigInt<E> {
      return Is.typeOf(value, 'bigint', each);
   }

   static sBigInt<E extends boolean = false>(value: any, each?: E): value is ReturnIsBigInt<E> {
      return Is.typeOf(value, 'sbigint', each);
   }

   static uBigInt<E extends boolean = false>(value: any, each?: E): value is ReturnIsBigInt<E> {
      return Is.typeOf(value, 'ubigint', each);
   }

   static boolean<E extends boolean = false, R = E extends true ? boolean[] : boolean>(value: any, each?: E): value is R {
      return Is.typeOf(value, 'boolean', each);
   }

   static string<E extends boolean = false>(value: any, each?: E): value is ReturnIsString<E> {
      return Is.typeOf(value, 'string', each);
   }

   static null<E extends boolean = false>(value: any, each?: E): value is ReturnIsNull<E> {
      return Is.typeOf(value, 'null', each);
   }

   static undefined<E extends boolean = false>(value: any, each?: E): value is ReturnIsUndefined<E> {
      return Is.typeOf(value, 'undefined', each);
   }

   static nan<E extends boolean = false, R = E extends true ? (typeof NaN)[] : typeof NaN>(value: any, each?: E): value is R {
      return Is.typeOf(value, 'NaN', each);
   }

   static symbol<E extends boolean = false>(value: any, each?: E): value is ReturnIsSymbol<E> {
      return Is.typeOf(value, 'symbol', each);
   }

   static map<E extends boolean = false, R = E extends true ? Map<any, any>[] : Map<any, any>>(value: any, each?: E): value is R {
      return Is.typeOf(value, 'map', each);
   }

   static set<E extends boolean = false, R = E extends true ? Set<any>[] : Set<any>>(value: any, each?: E): value is R {
      return Is.typeOf(value, 'set', each);
   }

   static regex<E extends boolean = false, R = E extends true ? RegExp[] : RegExp>(value: any, each?: E): value is R {
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

   static nullOrUndefined<E extends boolean = false>(value: any, each?: E): value is ReturnIsNull<E> | ReturnIsUndefined<E> {
      return Is.each(each, value, (item: any) => item === undefined || item === null);
   }

   static strongPassword<E extends boolean = false>(value: any, options?: StrongPasswordOptions, each?: E): value is ReturnIsString<E> {
      return Is.each(each, value, (item: any) => {
         if (typeof item !== 'string') {
            return false;
         }

         const minLength = options?.minLength ?? 8;
         const noSpaces = options?.noSpaces ?? true;
         const minSpecialChars = options?.minSpecialChars ?? 1;
         const minUpper = options?.minUpper ?? 1;
         const minLower = options?.minLower ?? 1;
         const minNumber = options?.minNumber ?? 1;

         if (
            item.length < minLength ||
            (noSpaces && item.match(/\s+/)) ||
            (item.match(/[._-~`@#$%^&*()+=,]/g) || []).length < minSpecialChars ||
            (item.match(/[A-Z]/g) || []).length < minUpper ||
            (item.match(/[a-z]/g) || []).length < minLower ||
            (item.match(/[0-9]/g) || []).length < minNumber
         ) {
            return false;
         }

         return true;
      });
   }

   static promise<E extends boolean = false, R = E extends true ? PromiseLike<any>[] : PromiseLike<any>>(value: any, each?: E): value is R {
      return Is.each(each, value, (item: any) => item !== null && typeof item === 'object' && typeof item.then === 'function');
   }

   static email<E extends boolean = false>(value: any, each?: E): value is ReturnIsString<E> {
      return Is.each(each, value, (item: any) => typeof item === 'string' && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(item));
   }

   static inArray(value: any, array: any[], each?: boolean): boolean {
      return Is.each(each, value, (item: any) => array.includes(item));
   }

   static includes(value: any, target: any, each?: boolean): boolean {
      return Is.each(each, value, (item: any) => {
         if (Is.string(item)) {
            return Is.string(target) ? item.includes(target) : false;
         }

         if (Is.array(item)) {
            return item.includes(target);
         }

         if (Is.object(item) && (Is.object(target) || Is.string(target))) {
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
                  if (!value.hasOwnProperty(key) || !Is.equals(item[key], target[key])) {
                     return false;
                  }
               }
            }

            return true;
         }
      });
   }

   static class<E extends boolean = false, R = E extends true ? ClassConstructor<any>[] : ClassConstructor<any>>(value: any, each?: boolean): value is R {
      return Is.each(each, value, (item: any) => Is.func(item) && item.toString()?.startsWith('class '));
   }

   static each(each: boolean, value: any, callback: (item: any) => boolean): boolean {
      if (each) {
         if (!Array.isArray(value)) {
            return false;
         }

         for (const val of value) {
            if (!callback(val)) {
               return false;
            }
         }

         return true;
      }

      return callback(value);
   }

   static arrayUnique(value: any, each?: boolean): value is any[] {
      return Is.each(each, value, (item: any) => {
         if (!Array.isArray(item)) {
            return false;
         }

         const unique = [];

         for (const val of item) {
            if (unique.findIndex((uni) => Is.equals(uni, val)) !== -1) {
               return false;
            }

            unique.push(val);
         }

         return true;
      });
   }

   static mongoId<E extends boolean = false>(value: any, each?: E): value is ReturnIsString<E> {
      return Is.each(each, value, (item: any) => typeof item === 'string' && /^[0-9a-fA-F]{24}$/.test(item));
   }

   static matched<E extends boolean = false>(value: any, regex: RegExp, each?: E): value is ReturnIsString<E> {
      return Is.each(each, value, (item: any) => typeof item === 'string' && regex.test(item));
   }

   static creditCard(value: any, type?: CreditCardType, each?: boolean): boolean {
      return Is.each(each, value, (item: any) => {
         const amex = new RegExp('^3[47][0-9]{13}$').test(item);
         const visa = new RegExp('^4[0-9]{12}(?:[0-9]{3})?$').test(item);
         const cup1 = new RegExp('^62[0-9]{14}[0-9]*$').test(item);
         const cup2 = new RegExp('^81[0-9]{14}[0-9]*$').test(item);
         const mastercard = new RegExp('^5[1-5][0-9]{14}$').test(item);
         const mastercard2 = new RegExp('^2[2-7][0-9]{14}$').test(item);
         const disco1 = new RegExp('^6011[0-9]{12}[0-9]*$').test(item);
         const disco2 = new RegExp('^62[24568][0-9]{13}[0-9]*$').test(item);
         const disco3 = new RegExp('^6[45][0-9]{14}[0-9]*$').test(item);
         const diners = new RegExp('^3[0689][0-9]{12}[0-9]*$').test(item);
         const jcb = new RegExp('^35[0-9]{14}[0-9]*$').test(item);

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
      });
   }

   static min<E extends boolean = false>(value: any, number: number, each?: E): value is ReturnIsNumber<E> {
      return Is.each(each, value, (item: any) => typeof item === 'number' && item >= number);
   }

   static max<E extends boolean = false>(value: any, number: number, each?: E): value is ReturnIsNumber<E> {
      return Is.each(each, value, (item: any) => typeof item === 'number' && item <= number);
   }

   static valid<T extends IsValidType>(value: any, options: IsValidOptions<T>): boolean {
      const { type: method } = options;
      const invalidMethods = ['typeOf', 'prototype', 'nodeJs', 'valid', 'each'];
      const each: boolean = options.each === true;

      return Is.each(each, value, (item: any) => {
         if (invalidMethods.includes(method) || !Is.callable(Is[method])) {
            return false;
         }

         switch (method) {
            case 'object':
               return Is.object(item, options.meta as ObjectRulesOptions);

            case 'array':
               return Is.array(item, options.meta as ArrayRulesOptions);

            case 'objectOrArray':
               if (!Is.objectOrArray(item)) {
                  return false;
               }

               if (Array.isArray(item)) {
                  return Is.array(item, (options.meta as ObjectArrayRulesOptions)?.array);
               }

               return Is.object(item, (options.meta as ObjectArrayRulesOptions)?.object);

            case 'equals':
               const { equalsTo } = (options.meta as EqualsRulesOptions) ?? {};

               return equalsTo === undefined ? false : Is.equals(item, equalsTo);

            case 'flatObject':
               const { allowArray } = (options.meta as FlatObjectRulesOptions) ?? {};

               return Is.flatObject(item, allowArray);

            case 'strongPassword':
               return Is.strongPassword(item, options.meta as StrongPasswordOptions);

            case 'inArray':
               return Is.inArray(item, options.meta as any[]);

            case 'includes':
               return Is.includes(item, options.meta as any);

            case 'creditCard':
               return Is.creditCard(item, options.meta as CreditCardType);

            case 'matched':
               return Is.matched(item, options.meta as RegExp);

            case 'min':
               return Is.min(item, options.meta as number);

            case 'max':
               return Is.max(item, options.meta as number);

            default:
               return Is[method].call(null, item, false);
         }
      });
   }
}
