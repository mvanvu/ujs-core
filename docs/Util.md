## Util

### Usage

```javascript
import { Util, UtilRaceError } from '@maivubc/ujs-core';
```

#### clone<T>(src: T): T (any type and ignore reference pointer)

```javascript
const foo = { bar: 123 };
const foo2 = Util.clone(foo);
foo2.bar = 456;
foo.bar; // It returns: 123
foo2.bar; // It returns: 456
const fn = () => 1;
Util.clone(fn); // It returns: fn
```

#### Callback(fn, params: any[], instanceThis?: any): an async function to call if the value is callable

```javascript
// Call a none function, just do nothing and return it
await Util.callback('Im not callable'); // It returns: 'Im not callable'


// Call a function
await Util.callback(() => 'Hi!'); // It returns: 'Hi!'


// Call a function with arguments
await Util.callback((name: string, age: number) => `I'm ${name}, ${age} years old!`, ['Yu', 25]); // It returns: `I'm Yu, 25 years old!`


// Call a function with this instance

// Note: this instance can't call with arrow function
function whoAmI() {
return this;
}

await Util.callback(whoAmI, [], 'Iron man'); // It returns: 'Iron man'


// When the callback is an instance of Promise, then the arguments and this instance will be ignored
await Util.callback(new Promise((resolve) => resolve('Im here'))); // It returns: 'Im here'

```

#### sort(data: any[] | object, options?: { key?: string })

```javascript
Util.sort(['March', 'Jan', 'Feb', 'Dec']); // It returns: ['Dec', 'Feb', 'Jan', 'March']
Util.sort([1, 30, 4, 21, 100000]); // It returns: [1, 4, 21, 30, 100000]
Object.keys(Util.sort({ foo: 10, bar: 20 })); // It returns: ['bar', 'foo']

const sorted = Util.sort(Array({ foo: 10, bar: 20 }, { foo: 5, bar: 10 }), { key: 'foo' });
sorted; // It returns: Array({ foo: 5, bar: 10 }, { foo: 10, bar: 20 })
```

#### baseName(path: string, suffix?: string)

```javascript
Util.baseName('/www/site/home.html'); // It returns: 'home.html'
Util.baseName('/www/site/home.html', '.html'); // It returns: 'home'
Util.baseName('/some/path/'); // It returns: 'path'
```

#### dirName(path: string)

```javascript
Util.dirName('/etc/passwd'); // It returns: '/etc'
Util.dirName('/some/path/to/'); // It returns: '/some/path'
```

#### async race(callback: any, maxMiliseconds: number) -> Run a callback in the limited time (miliseconds)

```javascript
// Run the callback in around of maximum seconds otherwise it will be thrown an instance of UtilRaceError
await Util.race('Im not callable', 1); // It returns: 'Im not callable'

// Throw UtilRaceError because the callback run in 2 seconds while the maximum time is 1 seconds
const timeout = async () => {
   try {
      await Util.race(new Promise((resolve) => setTimeout(resolve, 2000)), 1000);
   } catch (e) {
      return e;
   }
};

(await timeout()) instanceof UtilRaceError; // It returns: true
```

#### Util.debug(...entries: any[])

```javascript
// Log the variable with deep properties and color
Util.debug({ user: { id: 1, ua: 'admin', age: 30, major: ['Full stack developer'] } });
```

#### Util.debugDev(...entries: any[])

```javascript
// The same Util.debug but only log in NodeJS and process?.env?.NODE_ENV === 'development'
```
