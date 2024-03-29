import { EventEmitter } from '../../src';

it('Core Event Emitter', async () => {
   // # Trigger and emit event in an easy way
   const eventEmitter = new EventEmitter();

   // ## OR create an instance for global scope
   // const eventEmitter = EventEmitter.getInstance();

   // # on(name: string, handler: EventHandler['handler'], priority?: number): this
   // ## Trigger an event
   eventEmitter.on('greet', (name: string, age: number) => `Hi! my name is ${name}, I'm ${age} years old`);

   // # emit(name: string | string[], ...args: any[]): any[]
   // ## Emit the events
   expect(eventEmitter.emit('greet', 'Amy', 16)).toEqual([`Hi! my name is Amy, I'm 16 years old`]);

   // # off(name?: string | string[]): this
   // ## Off the events (off all of the events if the name is undefined)
   eventEmitter.off('greet');
   expect(eventEmitter.emit('greet', 'Amy', 16)).toEqual([]);

   // ## Emit multi-events
   eventEmitter.on('theFirst', () => 'The first event');
   eventEmitter.on('theSecond', () => 'The second event');
   expect(eventEmitter.emit(['theFirst', 'theSecond'])).toEqual(['The first event', 'The second event']);

   // # emitAsync(name: string | string[], ...args: any[]): Promise<any>
   // ## Emit the events in async mode, it will return the result of Promise.all
   eventEmitter.on('whoAmI', () => new Promise((resolve) => setTimeout(() => resolve('Hmm! human')))); // Default priority is NORMAL (25)
   eventEmitter.on('whoAmI', () => `I'm god!`, EventEmitter.HIGH); // Set the priority is higher (100)
   expect(await eventEmitter.emitAsync('whoAmI')).toEqual([`I'm god!`, 'Hmm! human']);

   // # async emitAsyncSequently(name: string | string[], ...args: any[]): Promise<any[]>
   // ## The event will fire in sequentially, the next event will be fired after the previous event fired
   let isFirstFired = false;
   eventEmitter.on('sequently', () => new Promise((resolve) => setTimeout(() => resolve((isFirstFired = true)), 100)));
   eventEmitter.on('sequently', () => new Promise((resolve) => setTimeout(() => resolve(isFirstFired ? 'OK' : 'OOPS!'), 50)));
   expect(await eventEmitter.emitAsync('sequently')).toEqual([true, 'OOPS!']);
   expect(await eventEmitter.emitAsyncSequently('sequently')).toEqual([true, 'OK']);

   // # open(name?: string | string[]): this
   // ## Re-open the events (open all of the events if the name is undefined)
   eventEmitter.open('greet');
   expect(eventEmitter.emit('greet', 'Amy', 16)).toEqual([`Hi! my name is Amy, I'm 16 years old`]);

   // # remove(name: string | string[]): this
   // ## Remove the events, similar off but the events will be removed and can't re-open (remove all of the events if the name is undefined)
   eventEmitter.remove('greet');
   expect(eventEmitter.emit('greet', 'Amy', 16)).toEqual([]);

   eventEmitter.open('greet');
   expect(eventEmitter.emit('greet', 'Amy', 16)).toEqual([]);

   // # once(name: string, handler: EventHandler['handler']): this
   // ## Trigger the event in the first time then remove it
   eventEmitter.once('onlyOne', () => 'The first time');
   expect(eventEmitter.emit('onlyOne')).toEqual(['The first time']);
   expect(eventEmitter.emit('onlyOne')).toEqual([]);
});
