## Util

### Usage

```javascript
import { Util, UtilRaceError } from '@mvanvu/ujs';
```

#### clone<T>(src: T): T => (any type and ignore reference pointer)

```javascript
const foo = { bar: 123 };
const foo2 = Util.clone(foo);
foo2.bar = 456;
foo.bar; // It returns: 123
foo2.bar; // It returns: 456
const fn = () => 1;
Util.clone(fn); // It returns: fn
```

#### async callback<T>(fn: any, params: any[] = [], inst?: any): Promise<T>

```javascript
// @deprecated use call() instead
```

#### call<T>(instanceThis: any, fn: any, ...params: any[]): T

```javascript
// Call a none function, just do nothing and return it
Util.call(null, 'Im not callable'); // It returns: 'Im not callable'


// Call a function
Util.call(null, () => 'Hi!'); // It returns: 'Hi!'


// Call a function with arguments
Util.call(null, (name: string, age: number) => `I'm ${name}, ${age} years old!`, 'Yu', 25); // It returns: `I'm Yu, 25 years old!`


// Call a function with this instance

// Note: this instance can't call with arrow function
function whoAmI() {
return this;
}

Util.call('Iron man', whoAmI); // It returns: 'Iron man'

```

#### callAsync<T>(instanceThis: any, fn: any, ...params: any[]): Promise<T>

```javascript
await Util.callAsync(null, new Promise((resolve) => resolve('Im here'))); // It returns: 'Im here'
```

#### sort<T extends any[] | ObjectRecord>(data: T, options?: { key?: string }): T

```javascript
Util.sort(['March', 'Jan', 'Feb', 'Dec']); // It returns: ['Dec', 'Feb', 'Jan', 'March']
Util.sort([1, 30, 4, 21, 100000]); // It returns: [1, 4, 21, 30, 100000]

// Sort by desc (defaults to asc)
Util.sort([1, 30, 4, 21, 100000], { desc: true }); // It returns: [100000, 30, 21, 4, 1]

// Sort by key
const sorted = Util.sort(Array({ foo: 10, bar: 20 }, { foo: 5, bar: 10 }), { key: 'foo' });
sorted; // It returns: Array({ foo: 5, bar: 10 }, { foo: 10, bar: 20 })
```

#### baseName(path: string, suffix?: string): string

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

#### race<T>(callback: any, maxMiliseconds: number): Promise<T> => Run a callback in the limited time (miliseconds)

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

#### Util.debug(...entries: any[]): void

```javascript
// Log the variable with deep properties and color
Util.debug({ user: { id: 1, ua: 'admin', age: 30, major: ['Full stack developer'] } });
```

#### Util.debugDev(...entries: any[]): void

```javascript
// The same Util.debug but only log in NodeJS and process?.env?.NODE_ENV === 'development'
```

#### numberFormat(number: number, options?: NumberFormatOptions): string

```javascript
Util.numberFormat(1234.567); // It returns: '1,235'
Util.numberFormat(1234.567, { decimals: 2 }); // It returns: '1,234.57'
Util.numberFormat(1234.567, { decimals: 2, decimalPoint: ',', separator: '' }); // It returns: '1234,57'

// With prefix
Util.numberFormat(1234.567, { decimals: 2, prefix: '$' }); // It returns: '$1,234.57'

// With suffix
Util.numberFormat(1234.567, { decimals: 2, suffix: 'USD' }); // It returns: '1,234.57USD'

// With pattern (the string that contains {value})
Util.numberFormat(1234.567, { decimals: 2, pattern: '$${value}' }); // It returns: '$$1,234.57'
```

#### Util.cloneObjectToCamelCase<TResult = ObjectRecord>(obj: ObjectRecord): TResult

```javascript
// Clone the object or deep array and change the snack key to camel case
const obj = {
   foo_bar: { bar_foo: { num_type: { num_int: 123, num_float: 1.23, deep_array: [123, { child_element: { foo_bar: 123 } }] } }, str_type: 'string' },
   bool_type: true,
};
const res = {
   fooBar: { barFoo: { numType: { numInt: 123, numFloat: 1.23, deepArray: [123, { childElement: { fooBar: 123 } }] } }, strType: 'string' },
   boolType: true,
};
Util.cloneObjectToCamelCase(obj); // It returns: res
```
