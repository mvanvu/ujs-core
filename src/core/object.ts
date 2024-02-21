'use strict';
import { Registry } from './registry';
import { Is } from './is';
import { clone, resetObject } from './func';

export class Obj extends Object {
   static pick<T extends object>(source: T, props: string | string[]) {
      const src = Registry.create(source);
      const dest = Registry.create();

      if (!Array.isArray(props)) {
         props = [props];
      }

      for (const prop of props) {
         dest.set(prop, src.get(prop));
      }

      return dest.toObject();
   }

   static omit<T extends object>(source: T, props: string | string[]) {
      const dest = Registry.create(source);

      if (!Array.isArray(props)) {
         props = [props];
      }

      for (const prop in props) {
         dest.remove(prop);
      }

      return dest.toObject();
   }

   static contains(source: object, target: object) {
      for (const key in target) {
         if (!source.hasOwnProperty(key) || !Is.equals(source[key], target[key])) {
            return false;
         }
      }

      return true;
   }

   static excludes<T extends object, K extends keyof T>(target: T, props: K[] | K): Omit<T, K> {
      for (const prop of Array.isArray(props) ? props : [props]) {
         delete target[prop];
      }

      return target;
   }

   static extends(target: object, ...sources: object[]) {
      for (const source of sources) {
         for (const key in source) {
            const data = source[key];

            if (Is.object(target[key]) && Is.object(data)) {
               Obj.extends(target[key], data);
            } else {
               Object.assign(target, { [key]: Is.flat(data) ? data : clone(data) });
            }
         }
      }

      return target;
   }

   // Alias from resetObject function
   static reset<T extends object>(obj: object, newData?: T): T | {} {
      return resetObject(obj, newData);
   }

   // Alias from Is.object (not Array)
   static isObject(value: any) {
      return Is.object(value);
   }
}
