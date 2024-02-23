'use strict';
import { Transform } from './transform';
import { clone } from './func';
export type RegistryParamType = string | Registry | Record<string, any> | any[];
export type RegistryDataType = Record<string, any> | any[];
export class RegistryDataError extends Error {}

export class Registry {
   private cached: Record<string, any> = {};
   private data: RegistryDataType;

   constructor(data?: RegistryParamType) {
      this.parse(data);
   }

   static from(data?: RegistryParamType | Registry) {
      return new Registry(data);
   }

   merge(data?: RegistryParamType | Registry) {
      const obj = Registry.from(data).clone().valueOf();
      const deepMerge = (path: string, value: any) => {
         if (value !== null && typeof value === 'object') {
            if (Array.isArray(value)) {
               for (let i = 0, n = value.length; i < n; i++) {
                  deepMerge(`${path}.${i}`, value[i]);
               }
            } else {
               for (const p in value) {
                  deepMerge(`${path}.${p}`, value[p]);
               }
            }
         } else {
            this.set(path, value);
         }
      };

      for (const path in obj) {
         deepMerge(path, obj[path]);
      }

      return this;
   }

   parse(data?: RegistryParamType) {
      if (data instanceof Registry) {
         this.data = data.clone().data;

         return this;
      }

      if (data === undefined) {
         data = {};
      } else if (typeof data === 'string' && ['{', '['].includes(data[0])) {
         try {
            data = JSON.parse(data);
         } catch {
            throw new RegistryDataError('Invalid JSON string data');
         }
      } else if (typeof data === 'object' && data !== null) {
         // Renew data to ignore the Object reference
         data = clone(data);
      }

      if (!data || typeof data !== 'object') {
         throw new RegistryDataError(
            'Invalid registry data, the data must be an Object<key, value> or a JSON string or an ARRAY',
         );
      }

      this.data = data || {};

      return this;
   }

   validate(data?: any) {
      const deepCheck = (data: any) => {
         if (Array.isArray(data)) {
            for (const datum of data) {
               deepCheck(datum);
            }
         } else if (typeof data === 'object' && data !== null) {
            if (Object.prototype.toString.call(data) !== '[object Object]') {
               throw new RegistryDataError(
                  'The object element data must be an Object<key, value> pair, not from any Class/Function constructor',
               );
            }

            for (const k in data) {
               deepCheck(data[k]);
            }
         } else if (typeof data === 'function') {
            throw new RegistryDataError('The object element data must be not a function');
         }
      };

      deepCheck(data === undefined ? this.data : data);

      return this;
   }

   isValidData() {
      try {
         this.validate();
      } catch {
         return false;
      }

      return true;
   }

   private isPathNum(path: string) {
      return /^\d+$/.test(path);
   }

   get<T>(path: string, defaultValue?: any, filter?: string | string[]): T {
      const isDeep = (value: any) => (typeof value === 'object' && value !== null) || Array.isArray(value);

      if (this.cached[path] === undefined) {
         if (path.indexOf('.') === -1) {
            this.cached[path] = this.data[path];
         } else {
            const paths = path.split('.');
            let data = this.data;

            for (let i = 0, n = paths.length; i < n; i++) {
               const path = paths[i];
               data = data[path];

               if (!isDeep(data)) {
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

   set(path: string, value: any) {
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

      return this;
   }

   has(path: string) {
      return this.get(path) !== undefined;
   }

   is(path: string, compareValue?: any) {
      const value = this.get(path);

      if (compareValue === undefined) {
         return Transform.toBoolean(value);
      }

      return value === compareValue;
   }

   /**
    *
    * @param path
    * For test caching purpose
    */
   isCached(path: string) {
      return this.cached.hasOwnProperty(path);
   }

   isPathArray(path?: string) {
      return Array.isArray(path ? this.get(path) : this.data);
   }

   isPathObject(path?: string) {
      const value = path ? this.get(path) : this.data;

      return value !== null && typeof value === 'object' && !Array.isArray(value);
   }

   remove(path: string) {
      return this.set(path, undefined);
   }

   toString() {
      return JSON.stringify(this.data);
   }

   valueOf() {
      return this.data;
   }

   clone() {
      return new Registry(JSON.stringify(this.data));
   }

   pick(paths: string[] | string) {
      const registry = Registry.from();

      for (const path of Array.isArray(paths) ? paths : [paths]) {
         registry.set(path, this.get(path));
      }

      return registry;
   }

   omit(paths: string[] | string) {
      const registry = this.clone();

      for (const path of Array.isArray(paths) ? paths : [paths]) {
         registry.remove(path);
      }

      return registry;
   }
}
