'use strict';

import { Registry } from './registry';
import { Is } from './is';

export class Arr extends Array {
   #index = 0;

   get elements() {
      return [...this.values()];
   }

   get currentIndex() {
      return this.#index;
   }

   private static calc<T>(source: T[], options: { type: 'sum' | 'avg' | 'min' | 'max'; key?: string }) {
      if (!source.length) {
         return;
      }

      const type = options.type;
      const key = options?.key ?? '';

      switch (type) {
         case 'sum':
         case 'avg':
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

                  if (
                     typeof num === 'number' &&
                     ((num < state.value && type === 'min') || (num > state.value && type === 'max'))
                  ) {
                     state.value = num;
                     state.index = i;
                  }
               }
            }

            return source[state.index];
      }
   }

   static sum<T>(source: T[], options?: { key?: string }) {
      return Arr.calc(source, { ...(options || {}), type: 'sum' });
   }

   static avg<T>(source: T[], options?: { key?: string }) {
      return Arr.calc(source, { ...(options || {}), type: 'avg' });
   }

   static min<T>(source: T[], options?: { key?: string }) {
      return Arr.calc(source, { ...(options || {}), type: 'min' });
   }

   static max<T>(source: T[], options?: { key?: string }) {
      return Arr.calc(source, { ...(options || {}), type: 'max' });
   }

   private static compare<T>(a: T[], b: T[], type: 'intersect' | 'diff') {
      const output = [];

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

   static intersect(a: any[], b: any[]) {
      return Arr.compare(a, b, 'intersect');
   }

   static diff(a: any[], b: any[]) {
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

   static from(elements: Iterable<any> | ArrayLike<any>) {
      const arr = new Arr();
      arr.push(...Array.from(elements));

      return arr;
   }

   sum(options?: { key?: string }) {
      return Arr.sum(this.elements, options);
   }

   avg(options?: { key?: string }) {
      return Arr.avg(this.elements, options);
   }

   min(options?: { key?: string }) {
      return Arr.min(this.elements, options);
   }

   max(options?: { key?: string }) {
      return Arr.max(this.elements, options);
   }

   intersect(target: any[]) {
      return Arr.intersect(this.elements, target);
   }

   diff(target: any[]) {
      return Arr.diff(this.elements, target);
   }

   chunk(size = 1) {
      return Arr.chunk(this.elements, size);
   }

   reset() {
      this.#index = 0;

      return this;
   }

   current() {
      return this.elements[this.#index];
   }

   first() {
      return this.elements[(this.#index = 0)];
   }

   last() {
      return this.elements[(this.#index = this.elements.length - 1)];
   }

   prev() {
      return this.elements[--this.#index];
   }

   next() {
      return this.elements[++this.#index];
   }

   empty() {
      this.splice(0, this.elements.length);

      return this;
   }

   update(elements: Iterable<any> | ArrayLike<any>) {
      this.empty().push(...Arr.from(elements));

      return this;
   }
}
