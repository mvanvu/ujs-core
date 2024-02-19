'use strict';
import { Transform } from './transform';
import { clone } from './func';
type RegistryParamType = string | Record<string, any> | any[];
type RegistryDataType = Record<string, any> | any[];

export class Registry {
   private cached: Record<string, any> = {};
   private data: RegistryDataType;

   constructor(data?: RegistryParamType, noRef = true) {
      this.parse(data, noRef);
   }

   static create(data?: RegistryParamType, noRef = true) {
      return new Registry(data, noRef);
   }

   merge(data?: RegistryParamType, noRef = true) {
      const obj = Registry.create(data, noRef).toObject();
      const deepMerge = (path: string, value: any) => {
         if (value !== null && (typeof value === 'object' || Array.isArray(value))) {
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

   parse(data?: RegistryParamType, noRef = true) {
      if (data === undefined) {
         data = {};
      } else if (typeof data === 'string' && data[0] === '{') {
         try {
            data = JSON.parse(data);
         } catch {}
      } else if (typeof data === 'object' && data !== null && noRef) {
         // Renew data to ignore the Object reference
         data = clone(data);
      }

      if (!data || typeof data !== 'object') {
         throw new Error('Invalid registry data, the data must be an Object<key, value> or a JSON string or an ARRAY');
      }

      this.data = data || {};

      return this;
   }

   private isPathNum(path: string) {
      return /^\d+$/.test(path);
   }

   get<T>(path: string, defaultValue?: any, filter?: string | string[]): T {
      if (this.cached[path] === undefined) {
         if (path.indexOf('.') === -1) {
            this.cached[path] = this.data[path];
         } else {
            this.cached[path] = this.data;

            for (let key of path.split('.')) {
               if (this.cached[path] === undefined) {
                  break;
               }

               this.cached[path] = this.cached[path][key];
            }
         }
      }

      if (this.cached[path] === undefined) {
         return defaultValue;
      }

      return <T>(filter ? Transform.clean(this.cached[path], filter) : this.cached[path]);
   }

   set(path: string, value: any) {
      // Remove cached data
      for (const key in this.cached) {
         if (key.endsWith(path)) {
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

   remove(path: string) {
      return this.set(path, undefined);
   }

   toObject() {
      return this.data;
   }

   toString() {
      return JSON.stringify(this.data);
   }

   clone() {
      return Registry.create(this.toObject(), true);
   }

   pick(paths: string[] | string) {
      const registry = Registry.create();

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
