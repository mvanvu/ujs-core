'use strict';
import { ObjectRecord, EventHandler } from '../type';
import { Is } from './is';
import { Transform } from './transform';
import { EventEmitter } from './event-emitter';
import { Util } from './util';
export type RegistryDataType = ObjectRecord | any[];
export class RegistryDataError extends Error {}

export class Registry {
   #eventEmitter = new EventEmitter();

   private cached: Record<string, any> = {};
   private data: RegistryDataType;

   constructor(data?: any, options?: { validate?: boolean; clone?: boolean }) {
      this.parse(data, options);
   }

   static from(data?: any, options?: { validate?: boolean; clone?: boolean }): Registry {
      return new Registry(data, options);
   }

   /**
    * @deprecated use extends instead
    */
   merge(data: any, validate?: boolean): this {
      return this.extends(data, validate);
   }

   extends(data: any, validate?: boolean): this {
      const deepExtends = (data: any, path?: string) => {
         if (Is.array(data)) {
            for (let i = 0, n = data.length; i < n; i++) {
               deepExtends(data[i], `${path ? `${path}.` : ''}${i}`);
            }
         } else if (Is.object(data)) {
            for (const p in data) {
               deepExtends(data[p], `${path ? `${path}.` : ''}${p}`);
            }
         } else if (Is.string(path)) {
            this.set(path, data, validate);
         }
      };

      deepExtends(Registry.from(data).valueOf());

      return this;
   }

   parse(data?: any, options?: { validate?: boolean; clone?: boolean }): this {
      if (data === undefined) {
         data = {};
      } else if (Is.string(data) && ['{', '['].includes(data[0])) {
         try {
            data = JSON.parse(data);
         } catch {
            throw new RegistryDataError('Invalid JSON string data');
         }
      } else if ((Is.object(data) || Is.array(data)) && options?.clone !== false) {
         // Renew data to ignore the Object reference
         data = Util.clone(data);
      }

      this.data = data;

      if (!this.isPathArray() && !this.isPathObject()) {
         throw new RegistryDataError('Invalid registry data, the data must be an Object<key, value> or a JSON string or an ARRAY');
      }

      if (options?.validate === true) {
         this.validate();
      }

      // Reset caching
      this.cached = {};

      return this;
   }

   validate(data?: any): this {
      if (!this.isValidData(data)) {
         throw new RegistryDataError(
            'The object element data must be a Record<key, value> or Array<[flat] | Record<key, value>> not from any Class/Function constructor',
         );
      }

      return this;
   }

   isValidData(data?: any): boolean {
      data = data ?? this.data;

      if (Array.isArray(data)) {
         for (const datum of data) {
            if (Is.object(datum) && !Is.flatObject(datum)) {
               return false;
            }
         }

         return true;
      } else if (Is.object(data) && !Is.flatObject(data)) {
         return false;
      }

      return true;
   }

   private isPathNum(path: string): boolean {
      return /^\d+$/.test(path);
   }

   private preparePath(path: string) {
      if (path.match(/\[\d+\]/)) {
         path = Transform.trim(path.replace(/\[(\d+)\]/g, '.$1'), { specialChars: '.' });
      }

      return path;
   }

   get<T>(path: string, defaultValue?: any, filter?: string | string[]): T {
      path = this.preparePath(path);

      if (this.cached[path] === undefined) {
         if (path.indexOf('.') === -1) {
            this.cached[path] = this.data[path];
         } else {
            const paths = path.split('.');
            let data = this.data;

            for (let i = 0, n = paths.length; i < n; i++) {
               const path = paths[i];
               data = data[path];

               if (!Is.objectOrArray(data)) {
                  data = i + 1 === n ? data : defaultValue;
                  break;
               }
            }

            this.cached[path] = data;
         }
      }

      if (this.cached[path] === undefined || this.cached[path] === defaultValue) {
         return defaultValue;
      }

      return <T>(filter ? Transform.clean(this.cached[path], filter) : this.cached[path]);
   }

   set(path: string, value: any, validate?: boolean): this {
      path = this.preparePath(path);
      const prevValue = this.get(path);

      if (validate === true) {
         this.validate(value);
      }

      // Remove cached data
      for (const key in this.cached) {
         if (key.startsWith(path)) {
            delete this.cached[key];
         }
      }

      if (path.indexOf('.') === -1) {
         if (value === undefined) {
            if (this.isPathNum(path) && Array.isArray(this.data)) {
               this.data.splice(Number(path), 1);
            } else {
               delete this.data[path];
            }
         } else {
            this.data[path] = value;
         }
      } else {
         let data = this.data;
         const keys = path.split('.');
         const n = keys.length - 1;

         for (let i = 0; i < n; i++) {
            const key = keys[i];

            if (!data[key] || (typeof data[key] !== 'object' && !Array.isArray(data[key]))) {
               // Invalid path, return this if the value === undefined (remove path)
               if (value === undefined) {
                  if (this.isPathNum(key) && Array.isArray(data[key])) {
                     data.splice(Number(key), 1);
                  } else {
                     delete data[key];
                  }

                  return this;
               }

               // Re-structure path
               if (this.isPathNum(key)) {
                  data[key] = [];
               } else {
                  data[key] = {};
               }
            }

            data = data[key];
         }

         const isArray = this.isPathNum(keys[n]);

         // Remove old value to clear object non reference
         if (isArray && Array.isArray(data)) {
            data.splice(Number(keys[n]), 1);
         } else {
            delete data[keys[n]];
         }

         if (value !== undefined) {
            if (isArray && !Array.isArray(data)) {
               data = [];
            }

            data[keys[n]] = value;
         }
      }

      const newValue = this.get(path);

      if (!Is.equals(prevValue, newValue)) {
         this.#eventEmitter.emit(path, newValue, prevValue);
      }

      if (value === undefined) {
         this.#eventEmitter.remove(path);
      }

      return this;
   }

   initPathValue<T>(path: string, value: T, validate?: boolean): T {
      if (!this.has(path)) {
         this.set(path, value, validate);
      }

      return value;
   }

   has(path: string): boolean {
      return !Is.undefined(this.get(path, undefined));
   }

   is(path: string, compareValue?: any): boolean {
      const value = this.get(path);

      if (Is.undefined(compareValue)) {
         return Transform.toBoolean(value);
      }

      return value === compareValue;
   }

   /**
    *
    * @param path
    * For test caching purpose
    */
   isCached(path: string): boolean {
      return this.cached.hasOwnProperty(this.preparePath(path));
   }

   isPathArray(path?: string): boolean {
      return Is.array(path ? this.get(path) : this.data);
   }

   isPathObject(path?: string): boolean {
      return Is.object(path ? this.get(path) : this.data);
   }

   isPathFlat(path: string): boolean {
      return Is.flatValue(this.get(path));
   }

   remove(path: string): this {
      return this.set(path, undefined);
   }

   toString(): string {
      return JSON.stringify(this.data);
   }

   valueOf<T extends RegistryDataType>(): T {
      return <T>this.data;
   }

   clone(): Registry {
      return Registry.from(this.data, { clone: true });
   }

   pick(paths: string[] | string): Registry {
      const registry = Registry.from();

      for (const path of Array.isArray(paths) ? paths : [paths]) {
         const p = this.preparePath(path);
         registry.set(p, this.get(p));
      }

      return registry;
   }

   omit(paths: string[] | string): Registry {
      const registry = this.clone();

      for (const path of Array.isArray(paths) ? paths : [paths]) {
         registry.remove(this.preparePath(path));
      }

      return registry;
   }

   watch(paths: string[] | string, callback: EventHandler['handler']) {
      for (const path of Array.isArray(paths) ? paths : [paths]) {
         const p = this.preparePath(path);

         if (!this.#eventEmitter.has(p)) {
            this.#eventEmitter.on(p, callback);
         }
      }
   }
}
