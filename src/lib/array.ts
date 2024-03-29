'use strict';

import { Registry } from './registry';
import { Is } from './is';
import { DefaultArray } from '../type';

export class Arr extends Array {
   #index = 0;

   get elements() {
      return [...this.values()];
   }

   get currentIndex() {
      return this.#index;
   }

   static calc(source: any[], options: { type: 'sum' | 'avg' | 'min' | 'max'; key?: string }) {
      const type = options.type;
      const key = options?.key ?? '';

      switch (type) {
         case 'sum':
         case 'avg':
            if (!source.length) {
               return 0;
            }

            let sum = 0;

            for (const rec of source) {
               if (typeof rec === 'number') {
                  sum += Number(rec) || 0;
               } else if (key && Is.object(rec)) {
                  sum += Registry.from(rec).get<number>(key, 0, 'toNumber');
               }
            }

            return type === 'sum' ? sum : sum / source.length;

         case 'min':
         case 'max':
            const state = { value: Number.MAX_VALUE * (type === 'min' ? 1 : -1), index: -1 };

            for (let i = 0, n = source.length; i < n; i++) {
               const el = source[i];

               if (typeof el === 'number' && ((el < state.value && type === 'min') || (el > state.value && type === 'max'))) {
                  state.value = el;
                  state.index = i;
               } else if (key && Is.object(el)) {
                  const num = Registry.from(<object>el).get(key);

                  if (typeof num === 'number' && ((num < state.value && type === 'min') || (num > state.value && type === 'max'))) {
                     state.value = num;
                     state.index = i;
                  }
               }
            }

            return source[state.index];
      }
   }

   static sum(source: any[], options?: { key?: string }): number {
      return Arr.calc(source, { ...(options || {}), type: 'sum' });
   }

   static avg(source: any[], options?: { key?: string }): number {
      return Arr.calc(source, { ...(options || {}), type: 'avg' });
   }

   static min<T>(source: any[], options?: { key?: string }): T {
      return Arr.calc(source, { ...(options || {}), type: 'min' });
   }

   static max<T>(source: any[], options?: { key?: string }): T {
      return Arr.calc(source, { ...(options || {}), type: 'max' });
   }

   static compare<T>(a: any[], b: any[], type: 'intersect' | 'diff'): T[] {
      const output: T[] = [];

      for (const v of a) {
         let matched = !!b.find((val) => Is.equals(val, v));

         if (type === 'diff') {
            matched = !matched;
         }

         if (matched && !output.find((o) => Is.equals(o, v))) {
            output.push(v);
         }
      }

      for (const v of b) {
         let matched = !!a.find((val) => Is.equals(val, v));

         if (type === 'diff') {
            matched = !matched;
         }

         if (matched && !output.find((o) => Is.equals(o, v))) {
            output.push(v);
         }
      }

      return output;
   }

   static intersect<T>(a: any[], b: any[]): T[] {
      return Arr.compare(a, b, 'intersect');
   }

   static diff<T>(a: any[], b: any[]): T[] {
      return Arr.compare(a, b, 'diff');
   }

   static chunk<T>(array: T[], size = 1): Array<T[]> {
      const output = [];
      let index = 0;
      size = parseInt(size.toString());

      for (let i = 0, n = array.length; i < n; i++) {
         let chunk = output[index];

         if (chunk && chunk.length >= size) {
            chunk = output[++index];
         }

         if (!chunk) {
            output.push((chunk = []));
         }

         chunk.push(array[i]);
      }

      return output;
   }

   static from(elements: Iterable<any> | ArrayLike<any>): Arr {
      const arr = new Arr();
      arr.push(...Array.from(elements));

      return arr;
   }

   static update<T extends any[]>(array: any[], ...elements: T): DefaultArray<T> {
      array.splice(0, array.length);

      if (elements.length) {
         array.push(...elements);
      }

      return array as DefaultArray<T>;
   }

   sum(options?: { key?: string }): number {
      return Arr.sum(this.elements, options);
   }

   avg(options?: { key?: string }): number {
      return Arr.avg(this.elements, options);
   }

   min<T>(options?: { key?: string }): T {
      return Arr.min(this.elements, options);
   }

   max<T>(options?: { key?: string }): T {
      return Arr.max(this.elements, options);
   }

   intersect<T>(target: any[]): T[] {
      return Arr.intersect(this.elements, target);
   }

   diff<T>(target: any[]): T[] {
      return Arr.diff(this.elements, target);
   }

   chunk<T>(size = 1): Array<T[]> {
      return Arr.chunk(this.elements, size);
   }

   reset(): this {
      this.#index = 0;

      return this;
   }

   current<T>(): T | undefined {
      return this.elements[this.#index];
   }

   first<T>(): T | undefined {
      return this.elements[(this.#index = 0)];
   }

   last<T>(): T | undefined {
      return this.elements[(this.#index = this.elements.length - 1)];
   }

   prev<T>(): T | undefined {
      const index = this.#index - 1;

      if (this.elements[index] !== undefined) {
         this.#index = index;
      }

      return this.elements[index];
   }

   next<T>(): T | undefined {
      const index = this.#index + 1;

      if (this.elements[index] !== undefined) {
         this.#index = index;
      }

      return this.elements[index];
   }

   walk<T>(index: number | 'first' | 'last' | 'prev' | 'next', callback: Function): T | undefined {
      if (typeof callback !== 'function') {
         return;
      }

      if (typeof index !== 'number') {
         switch (index) {
            case 'first':
               index = 0;
               break;

            case 'last':
               index = this.elements.length - 1;
               break;

            case 'prev':
               index = this.#index - 1;
               break;

            case 'next':
               index = this.#index + 1;
               break;
         }
      }

      if (this.elements[index] !== undefined) {
         this.#index = index;

         return callback.apply(this, [index, this.elements]);
      }
   }

   empty(): this {
      this.splice(0, this.elements.length);

      return this;
   }

   update(elements: Iterable<any> | ArrayLike<any>): this {
      this.empty().push(...Arr.from(elements));

      return this;
   }
}
