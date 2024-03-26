## Event-emitter

### Usage

```javascript
import { EventEmitter } from '@mvanvu/ujs';
```

#### Trigger and emit event in an easy way

```javascript
const eventEmitter = new EventEmitter();

// OR create an instance for global scope
// const eventEmitter = EventEmitter.getInstance();
```

#### on(name: string, handler: EventHandler['handler'], priority?: number): this

```javascript
// Trigger an event
eventEmitter.on('greet', (name: string, age: number) => `Hi! my name is ${name}, I'm ${age} years old`);

```

#### emit(name: string | string[], ...args: any[]): any[]

```javascript
// Emit the events
eventEmitter.emit('greet', 'Amy', 16); // It returns: [`Hi! my name is Amy, I'm 16 years old`]
```

#### off(name?: string | string[]): this

```javascript
// Off the events (off all of the events if the name is undefined)
eventEmitter.off('greet');
eventEmitter.emit('greet', 'Amy', 16); // It returns: []

// Emit multi-events
eventEmitter.on('theFirst', () => 'The first event');
eventEmitter.on('theSecond', () => 'The second event');
eventEmitter.emit(['theFirst', 'theSecond']); // It returns: ['The first event', 'The second event']
```

#### emitAsync(name: string | string[], ...args: any[]): Promise<any>

```javascript
// Emit the events in async mode, it will return the result of Promise.all
eventEmitter.on('whoAmI', () => new Promise((resolve) => setTimeout(() => resolve('Hmm! human')))); // Default priority is NORMAL (25)
eventEmitter.on('whoAmI', () => `I'm god!`, EventEmitter.HIGH); // Set the priority is higher (100)
await eventEmitter.emitAsync('whoAmI'); // It returns: [`I'm god!`, 'Hmm! human']
```

#### open(name?: string | string[]): this

```javascript
// Re-open the events (open all of the events if the name is undefined)
eventEmitter.open('greet');
eventEmitter.emit('greet', 'Amy', 16); // It returns: [`Hi! my name is Amy, I'm 16 years old`]
```

#### remove(name: string | string[]): this

```javascript
// Remove the events, similar off but the events will be removed and can't re-open (remove all of the events if the name is undefined)
eventEmitter.remove('greet');
eventEmitter.emit('greet', 'Amy', 16); // It returns: []

eventEmitter.open('greet');
eventEmitter.emit('greet', 'Amy', 16); // It returns: []
```

#### once(name: string, handler: EventHandler['handler']): this

```javascript
// Trigger the event in the first time the it will be removed
eventEmitter.once('onlyOne', () => 'The first time');
eventEmitter.emit('onlyOne'); // It returns: ['The first time']
eventEmitter.emit('onlyOne'); // It returns: []
```
