'use strict';
import { Registry } from './registry';
import { Is } from './is';
import { Util } from './util';
import { Path, NestedPick, NestedOmit, ExtendsObject, ObjectKey, ExtendsObjects, UnionToIntersection, ResetObject } from '../type';

export class Obj {
   constructor(private objects: object) {}

   static pick<T extends object, K extends Path<T>>(source: T, props: K | K[]): NestedPick<T, K> {
      const src = Registry.from(source);
      const dest = Registry.from();

      for (const prop of Array.isArray(props) ? props : [props]) {
         dest.set(prop, src.get(prop));
      }

      return dest.valueOf();
   }

   static omit<T extends object, K extends Path<T>>(source: T, props: K | K[]): NestedOmit<T, K> {
      const dest = Registry.from(source);

      for (const prop of Array.isArray(props) ? props : [props]) {
         dest.remove(prop);
      }

      return dest.valueOf();
   }

   static contains(source: object, target: object | string): boolean {
      if (typeof target === 'string') {
         const paths = target.split('.');
         let o = source;

         for (let i = 0, n = paths.length; i < n; i++) {
            const prop = paths[i];

            if (!Is.object(o) || !o.hasOwnProperty(prop)) {
               return false;
            }

            o = o[prop];
         }
      } else {
         for (const key in target) {
            if (!source.hasOwnProperty(key) || !Is.equals(source[key], target[key])) {
               return false;
            }
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

   static #extendsOne<T extends object, O extends object>(target: T, source: O): ExtendsObject<T, O> {
      const result = target as ExtendsObject<T, O>;

      for (const key in source) {
         const k = <ObjectKey>key;
         const targetData = result[k];
         const sourceData = source[k];

         if (Is.object(targetData) && Is.object(sourceData)) {
            Obj.#extendsOne(targetData, sourceData);
         } else {
            Object.assign(result, { [k]: Util.clone(sourceData) });
         }
      }

      return result;
   }

   static extends<T extends object, O extends object[]>(target: T, ...sources: O): ExtendsObjects<T, O> {
      return (!sources.length ? target : Obj.extends(Obj.#extendsOne(target, sources.shift()), ...sources)) as ExtendsObjects<T, O>;
   }

   static reset<T extends undefined | null | object>(obj: object, newData?: T): ResetObject<T> {
      // Clean the object first
      for (const k in obj) {
         delete obj[k];
      }

      if (Is.object(newData)) {
         Object.assign(obj, newData);
      }

      return obj as ResetObject<T>;
   }

   static from(o: Record<string, any>): Obj {
      return new Obj(o);
   }

   static initPropValue<T>(o: Record<string, any>, prop: string, value: T): T {
      return Registry.from(o, { clone: false }).initPathValue(prop, value);
   }

   contains(target: Record<string, any> | string): boolean {
      return Obj.contains(this.objects, target);
   }

   extends(...sources: object[]) {
      return Obj.extends(this.objects, ...sources);
   }

   reset<T extends Record<string, any>>(newData?: T) {
      return Obj.reset(this.objects, newData);
   }

   initPropValue<T>(prop: string, value: T): T {
      return Obj.initPropValue(this.objects, prop, value);
   }

   valueOf(): object {
      return this.objects;
   }

   toString(): string {
      return JSON.stringify(this.objects);
   }
}
