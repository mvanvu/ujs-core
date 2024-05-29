import { Util } from './util';
import { Is } from './is';
import { EventHandler } from '../type';

export class EventEmitter {
   private _events: EventHandler[] = [];

   private static instance: EventEmitter;

   static get HIGH(): 100 {
      return 100;
   }

   static get MEDIUM(): 50 {
      return 50;
   }

   static get NORMAL(): 25 {
      return 25;
   }

   static get LOW(): 0 {
      return 0;
   }

   get events(): EventHandler[] {
      return this._events;
   }

   static getInstance(): EventEmitter {
      if (!EventEmitter.instance) {
         EventEmitter.instance = new EventEmitter();
      }

      return EventEmitter.instance;
   }

   on(name: string, handler: EventHandler['handler'], priority?: number): this {
      if (Is.callable(handler) && !this._events.find((evt) => evt.once === true)) {
         this._events.push({ name, handler, once: false, disabled: false, priority: Is.number(priority) ? priority : EventEmitter.NORMAL });

         // Re-order by priority
         Util.sort<EventHandler[]>(this._events, { key: 'priority', desc: true });
      }

      return this;
   }

   once(name: string, handler: EventHandler['handler']): this {
      if (Array.isArray(name)) {
         for (const n of name) {
            this.once(n, handler);
         }
      } else if (!this._events.find((evt) => evt.once === true)) {
         this._events.push({ name, handler, once: true, disabled: false, priority: EventEmitter.NORMAL });
      }

      return this;
   }

   has(name: string): boolean {
      return this._events.findIndex((evt) => evt.name === name) !== -1;
   }

   remove(name?: string | string[]): this {
      if (name === undefined) {
         this._events.splice(0, this._events.length);
      } else {
         if (Array.isArray(name)) {
            for (const n of name) {
               this.remove(n);
            }
         } else {
            const index = this._events.findIndex((evt) => evt.name === name);

            if (index !== -1) {
               this._events.splice(index, 1);
            }
         }
      }

      return this;
   }

   off(name?: string | string[]): this {
      const names = name === undefined ? [] : Array.isArray(name) ? name : [name];
      this._events.forEach((evt) => (!names.length || names.includes(evt.name)) && !evt.disabled && (evt.disabled = true));

      return this;
   }

   open(name?: string | string[]): this {
      const names = name === undefined ? [] : Array.isArray(name) ? name : [name];
      this._events.forEach((evt) => (!names.length || names.includes(evt.name)) && evt.disabled && (evt.disabled = false));

      return this;
   }

   getEventHandlers(name: string | string[]): EventHandler[] {
      const names = Array.isArray(name) ? name : [name];

      return this._events.filter((evt) => names.includes(evt.name) && !evt.disabled);
   }

   emit(name: string | string[], ...args: any[]): any[] {
      const ret = [];

      for (const event of this.getEventHandlers(name)) {
         ret.push(Util.call(this, event.handler, ...args));

         if (event.once) {
            this.remove(event.name);
         }
      }

      return ret;
   }

   emitAsync(name: string | string[], ...args: any[]): Promise<any[]> {
      return Promise.all(this.emit(name, ...args));
   }

   async emitAsyncSequently(name: string | string[], ...args: any[]): Promise<any[]> {
      const ret = [];

      for (const event of this.getEventHandlers(name)) {
         ret.push(await Util.callAsync(this, event.handler, ...args));
      }

      return ret;
   }
}
