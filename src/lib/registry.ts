'use strict';
import { ObjectRecord, EventHandler, PathValue, Path, IsEqual, NestedOmit, NestedPick, TransformType } from '../type';
import { Is } from './is';
import { Transform } from './transform';
import { EventEmitter } from './event-emitter';
import { Util } from './util';
export type RegistryDataType = ObjectRecord | any[];
export class RegistryDataError extends Error {}
export class RegistryConsistentError extends Error {}
export type RegistryOptions = { validate?: boolean; clone?: boolean; consistent?: boolean };

type PathOf<T> = T extends object ? Path<T> : string;

export class Registry<TData extends any, TPath = PathOf<TData>> {
   private consistent: boolean = false;
   private eventEmitter = new EventEmitter();

   private cached: Record<string, any> = {};
   private data: RegistryDataType;

   constructor(data?: TData, options?: RegistryOptions) {
      this.parse(data, options);
      this.consistent = options?.consistent === true;
   }

   static from<TData extends any, TPath = PathOf<TData>>(data?: TData, options?: RegistryOptions): Registry<TData, TPath> {
      return new Registry(data, options);
   }

   extends(data: any): this {
      const deepExtends = (data: any, path?: string) => {
         if (Is.array(data)) {
            if (path && !Is.array(this.get(path as TPath))) {
               this.set(path as TPath, []);
            }

            for (let i = 0, n = data.length; i < n; i++) {
               deepExtends(data[i], `${path ? `${path}.` : ''}${i}`);
            }
         } else if (Is.object(data)) {
            if (path && !Is.object(this.get(path as TPath))) {
               this.set(path as TPath, {});
            }

            for (const p in data) {
               deepExtends(data[p], `${path ? `${path}.` : ''}${p}`);
            }
         } else if (Is.primitive(data) && path) {
            this.set(path as TPath, data);
         }
      };

      deepExtends(Registry.from(data).valueOf());

      return this;
   }

   parse(data?: any, options?: { validate?: boolean; clone?: boolean }): this {
      this.validateConsistent();

      if (data === undefined) {
         data = {};
      } else if (Is.string(data) && ['{', '['].includes(data[0])) {
         try {
            data = JSON.parse(data);
         } catch {
            throw new RegistryDataError('Invalid JSON string data');
         }
      } else if (!Is.primitive(data) && options?.clone !== false) {
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

      if (Is.array(data)) {
         for (const datum of data) {
            if (Is.object(datum) && !Is.json(datum)) {
               return false;
            }
         }

         return true;
      } else if (Is.object(data) && !Is.json(data)) {
         return false;
      }

      return true;
   }

   private isPathNum(path: string): boolean {
      return /^\d+$/.test(path);
   }

   private preparePath(path: string): string {
      if (path.match(/\[\d+\]/)) {
         path = Transform.trim(path.replace(/\[(\d+)\]/g, '.$1'), { specialChars: '.' });
      }

      return path;
   }

   get<TResult = unknown, PathOrKey extends TPath = any>(
      path: PathOrKey,
      defaultValue?: any,
      filter?: TransformType | TransformType[],
   ): IsEqual<TResult, unknown> extends true ? (PathOrKey extends Path<TData> ? PathValue<TData, PathOrKey> : TResult) : TResult {
      const p = this.preparePath(path as string);

      if (this.cached[p] === undefined) {
         if (p.indexOf('.') === -1) {
            this.cached[p] = this.data?.[p];
         } else {
            const paths = p.split('.');
            let data = this.data;

            for (let i = 0, n = paths.length; i < n; i++) {
               const path = paths[i];
               data = data?.[path];

               if (!Is.json(data)) {
                  data = i + 1 === n ? data : defaultValue;
                  break;
               }
            }

            this.cached[p] = data;
         }
      }

      const notExists = this.cached[p] === undefined;

      if (notExists || this.cached[p] === defaultValue) {
         return defaultValue;
      }

      let value = this.cached[p];

      if (filter) {
         value = Transform.clean(value, filter);
      }

      return value;
   }

   private validateConsistent(path?: TPath): void {
      if (this.consistent) {
         throw new RegistryConsistentError(
            `This registry in consistent mode, make sure you don't get the no exists value and don't set/remove any value${path ? `, path: ${path}` : ''}`,
         );
      }
   }

   set(path: TPath, value: any, validate?: boolean): this {
      this.validateConsistent(path);
      const p = this.preparePath(path as string);
      const prevValue = this.get(path);

      if (validate === true) {
         this.validate(value);
      }

      // Remove cached data
      for (const key in this.cached) {
         if (key.startsWith(p)) {
            delete this.cached[key];
         }
      }

      if (p.indexOf('.') === -1) {
         if (value === undefined) {
            if (this.isPathNum(p) && Is.array(this.data)) {
               this.data.splice(Number(p), 1);
            } else {
               delete this.data?.[p];
            }
         } else {
            this.data[p] = value;
         }
      } else {
         let data = this.data;
         const keys = p.split('.');
         const n = keys.length - 1;

         for (let i = 0; i < n; i++) {
            const key = keys[i];

            if (!Is.json(data[key])) {
               // Invalid path, return this if the value === undefined (remove path)
               if (value === undefined) {
                  if (this.isPathNum(key) && Is.array(data[key])) {
                     data.splice(Number(key), 1);
                  } else {
                     delete data?.[key];
                  }

                  return this;
               }

               // Re-structure path
               data[key] = this.isPathNum(key) ? [] : {};
            }

            data = data[key];
         }

         const lastKey = keys[n];
         const isArray = this.isPathNum(lastKey);

         // Remove old value to clear object non reference
         if (isArray && Is.array(data)) {
            data.splice(Number(lastKey), 1);
         } else {
            delete data?.[lastKey];
         }

         if (value !== undefined && Is.json(data)) {
            data[lastKey] = value;
         }
      }

      const newValue = this.get(path);

      if (!Is.equals(prevValue, newValue)) {
         this.eventEmitter.emit(p, newValue, prevValue);
      }

      if (value === undefined) {
         this.eventEmitter.remove(p);
      }

      return this;
   }

   initPathValue<T = any>(path: TPath, value: T, validate?: boolean): T {
      if (!this.has(path)) {
         this.set(path, value, validate);
      }

      return value;
   }

   has<Path extends TPath>(path: Path): boolean {
      return this.get(path, undefined) !== undefined;
   }

   is(path: TPath, compareValue?: any): boolean {
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
   isCached(path: string): boolean {
      return this.cached.hasOwnProperty(this.preparePath(path));
   }

   isPathArray(path?: TPath): boolean {
      return Is.array(path ? this.get(path) : this.data);
   }

   isPathObject(path?: TPath): boolean {
      return Is.object(path ? this.get(path) : this.data);
   }

   isPathFlat(path: TPath): boolean {
      return Is.primitive(this.get(path));
   }

   remove(path: TPath): this {
      return this.set(path, undefined);
   }

   toString(): string {
      return JSON.stringify(this.data);
   }

   valueOf<T extends RegistryDataType = TData>(): T {
      return <T>this.data;
   }

   clone(): Registry<TData, TPath> {
      return Registry.from(this.data, { clone: true, consistent: this.consistent });
   }

   pick<TInclude extends TPath>(paths: TInclude[] | TInclude): Registry<NestedPick<TData, TInclude>> {
      const registry = Registry.from();

      for (const path of Is.array(paths) ? paths : [paths]) {
         const p = this.preparePath(path as string);
         registry.set(p as any, this.get(p as any));
      }

      registry.consistent = this.consistent;

      return registry as Registry<NestedPick<TData, TInclude>>;
   }

   omit<TExclude extends TPath>(paths: TExclude[] | TExclude): Registry<NestedOmit<TData, TExclude>> {
      const registry = this.clone();
      registry.consistent = false;

      for (const path of Is.array(paths) ? paths : [paths]) {
         registry.remove(this.preparePath(path as string) as any);
      }

      registry.consistent = this.consistent;

      return registry as Registry<NestedOmit<TData, TExclude>>;
   }

   watch(paths: TPath[] | TPath, callback: EventHandler['handler']) {
      for (const path of (Is.array(paths) ? paths : [paths]) as TPath[]) {
         const p = this.preparePath(path as string);

         if (!this.eventEmitter.has(p)) {
            this.eventEmitter.on(p, callback);
         }
      }
   }

   isEmpty(): boolean {
      return Is.empty(this.valueOf());
   }
}
