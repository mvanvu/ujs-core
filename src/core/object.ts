'use strict';
import { Registry } from './registry';
import { Is } from './is';
import { Util } from './util';

export class Obj {
   constructor(private objects: Record<string, any>) {}

   static pick<T extends object>(source: T, props: string | string[]) {
      const src = Registry.from(source);
      const dest = Registry.from();

      if (!Array.isArray(props)) {
         props = [props];
      }

      for (const prop of props) {
         dest.set(prop, src.get(prop));
      }

      return dest.valueOf();
   }

   static omit<T extends object>(source: T, props: string | string[]) {
      const dest = Registry.from(source);

      if (!Array.isArray(props)) {
         props = [props];
      }

      for (const prop in props) {
         dest.remove(prop);
      }

      return dest.valueOf();
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
               Object.assign(target, { [key]: Is.flatValue(data) ? data : Util.clone(data) });
            }
         }
      }

      return target;
   }

   // Alias from Is.object (not Array)
   static isObject(value: any) {
      return Is.object(value);
   }

   static create(o: object) {
      return new Obj(o);
   }

   contains(target: object) {
      return Obj.contains(this.objects, target);
   }

   extends(...sources: object[]) {
      return Obj.extends(this.objects, ...sources);
   }

   reset<T extends object>(newData?: T) {
      return Util.resetObject(this.objects, newData);
   }
}
