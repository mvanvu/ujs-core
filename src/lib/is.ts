'use strict';
import { DateTime } from './datetime';
import {
   ArrayRulesOptions,
   ClassConstructor,
   CreditCardType,
   EqualsRulesOptions,
   FlatObjectRulesOptions,
   IsBaseOptions,
   IsBooleanOptions,
   IsError,
   IsNumberOptions,
   IsStringOptions,
   IsValidOptions,
   IsValidType,
   ObjectArrayRulesOptions,
   ObjectCommonType,
   ObjectRecord,
   ObjectRulesOptions,
   ReturnIsBigInt,
   ReturnIsNull,
   ReturnIsNumber,
   ReturnIsPrimitive,
   ReturnIsPromise,
   ReturnIsString,
   ReturnIsSymbol,
   ReturnIsUndefined,
   StrongPasswordOptions,
} from '../type';

const ruleProto = '__IS_RULES__';
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

   static primitive(value: any, options?: IsBaseOptions): boolean {
      return Is.each(options, value, (item: any) => item === null || ['string', 'number', 'bigint', 'boolean', 'symbol', 'undefined'].includes(typeof item));
   }

   static empty(value: any, options?: IsBaseOptions): boolean {
      return Is.each(options, value, (item: any) => {
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

         if (item !== null && typeof item === 'object') {
            return !Object.keys(item).length;
         }

         if (Array.isArray(item) || Buffer.isBuffer(item)) {
            return !item.length;
         }

         return !Boolean(item);
      });
   }

   static object(value: any, options?: IsBaseOptions): value is ObjectRecord {
      return Is.each(options, value, (item: any) => item !== null && typeof item === 'object' && !Array.isArray(item));
   }

   static json(value: any, options?: IsBaseOptions): boolean {
      return Is.each(options, value, (item: any) => {
         if (!Is.object(item) || !Is.array(item)) {
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
            } else if (!Is.primitive(data)) {
               throw new Error();
            }
         };

         try {
            deepCheck(item);
         } catch {
            return false;
         }

         return true;
      });
   }

   static array<T>(value: any, options?: IsBaseOptions): value is T[] {
      return Is.each(options, value, (item: any) => Array.isArray(item));
   }

   static asyncFunc<E extends boolean = false>(value: any, each?: E): value is ReturnIsPromise<E> {
      return Is.each(each, value, (item: any) => item instanceof (async () => {}).constructor);
   }

   static func<E extends boolean = false, R = E extends true ? Function[] : Function>(value: any, each?: E): value is R {
      return Is.each(each, value, (item: any) => typeof item === 'function');
   }

   static callable<E extends boolean = false, R = E extends true ? Array<Function & PromiseLike<any>> : Function & PromiseLike<any>>(
      value: any,
      each?: E,
   ): value is R {
      return Is.each(each, value, (item: any) => Is.func(item) || Is.asyncFunc(item));
   }

   static number(value: any, options?: IsNumberOptions): boolean {
      return Is.each(options, value, (item: any) => {
         if (
            typeof item !== 'number' ||
            isNaN(item) ||
            (options?.integer && !Number.isInteger(item)) ||
            (options?.min && item < options.min) ||
            (options?.max && item > options.max)
         ) {
            return false;
         }

         return true;
      });
   }

   static boolean(value: any, options?: IsBooleanOptions): boolean {
      return Is.each(options, value, (item: any) => typeof item === 'boolean');
   }

   static string(value: any, options?: IsStringOptions): boolean {
      return Is.each(options, value, (item: any) => {
         if (
            typeof item !== 'string' ||
            (Is.number(options?.minLength) && item.length < options.minLength) ||
            (Is.number(options?.maxLength) && item.length > options.maxLength) ||
            (options?.notEmpty && !!item.length) ||
            (options?.format === 'email' &&
               !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                  item,
               )) ||
            (options?.format === 'date-time' && !DateTime.parse(item)) ||
            (options?.format === 'creditCard' && !Is.creditCard(item)) ||
            (options?.format === 'ipV4' &&
               !/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
                  item,
               )) ||
            (options?.format === 'mongoId' && !/^[0-9a-fA-F]{24}$/.test(item)) ||
            (options?.format === 'url' && !Boolean(new URL(item))) ||
            (options?.format instanceof RegExp && !options.format.test(item))
         ) {
            return false;
         }

         return true;
      });
   }

   static null<E extends boolean = false>(value: any, each?: E): value is ReturnIsNull<E> {
      return Is.each(each, value, (item: any) => item === null);
   }

   static undefined<E extends boolean = false>(value: any, each?: E): value is ReturnIsUndefined<E> {
      return Is.each(each, value, (item: any) => typeof item === 'undefined');
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

   static promise<E extends boolean = false>(value: any, each?: E): value is ReturnIsPromise<E> {
      return Is.each(each, value, (item: any) => item !== null && typeof item === 'object' && typeof item.then === 'function');
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

   static each(options: IsBaseOptions | undefined, value: any, callback: (item: any) => boolean): boolean {
      try {
         if (options?.isArray) {
            if (!Array.isArray(value)) {
               return false;
            }

            const unique = [];

            for (const val of value) {
               if (!callback(val) || (options.isArray === 'unique' && unique.findIndex((uni) => Is.equals(uni, val)) !== -1)) {
                  return false;
               }

               unique.push(val);
            }

            return true;
         }

         return callback(value);
      } catch {
         return false;
      }
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

   static url<E extends boolean = false>(value: any, each?: E): value is ReturnIsString<E> {
      return Is.each(each, value, (item: any) => {
         try {
            return typeof item === 'string' ? Boolean(new URL(item)) : false;
         } catch (e) {
            return false;
         }
      });
   }

   static addRule(rule: string, handler: (value: any) => boolean): void {
      if (Is.callable(handler)) {
         if (!Is.prototype[ruleProto]) {
            Is.prototype[ruleProto] = {};
         }

         Is.prototype[ruleProto][rule] = handler;
      }
   }

   static valid<T extends IsValidType>(value: any, options: IsValidOptions<T>): boolean {
      const { rule: method } = options;
      const invalidMethods = ['prototype', 'nodeJs', 'valid', 'each', 'addRule'];
      const each: boolean = options.each === true;

      return Is.each(each, value, (item: any) => {
         const rules = Is.prototype[ruleProto];
         const ruleHandler = rules?.[method];

         if (Is.callable(ruleHandler)) {
            return ruleHandler.call(null, item);
         }

         if (invalidMethods.includes(method)) {
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
               const handler = Is[method as any];

               return Is.callable(handler) ? handler.call(null, item, false) : false;
         }
      });
   }
}
