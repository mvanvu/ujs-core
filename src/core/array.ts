'use strict';

import { Registry } from './registry';
import { Is } from './is';

export class Arr extends Array {
   get data() {
      return Arr.from(this.values());
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
                  sum += Registry.create(rec).get<number>(key, 0, 'toNumber');
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
                  const num = Registry.create(<object>el).get(key);

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

   static create<T>(data: Iterable<T> | ArrayLike<T>) {
      const arr = new Arr();
      arr.push(...Array.from(data));

      return arr;
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

   static first<T>(array: T[]): T | undefined {
      return array.length ? array[0] : undefined;
   }

   static last<T>(array: T[]): T | undefined {
      return array.length ? array[array.length - 1] : undefined;
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

   calc(options: { type: 'sum' | 'avg' | 'min' | 'max'; key?: string }) {
      return Arr.calc(this.data, options);
   }

   sum(options?: { key?: string }) {
      return Arr.sum(this.data, options);
   }

   avg(options?: { key?: string }) {
      return Arr.avg(this.data, options);
   }

   min(options?: { key?: string }) {
      return Arr.min(this.data, options);
   }

   max(options?: { key?: string }) {
      return Arr.max(this.data, options);
   }

   intersect(target: any[]) {
      return Arr.intersect(this.data, target);
   }

   diff(target: any[]) {
      return Arr.diff(this.data, target);
   }

   first() {
      return Arr.first(this.data);
   }

   last() {
      return Arr.last(this.data);
   }

   chunk(size = 1) {
      return Arr.chunk(this.data, size);
   }
}
