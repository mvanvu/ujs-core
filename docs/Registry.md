## Registry

### Usage

```javascript
import { Registry, RegistryConsistentError, RegistryDataError } from '@mvanvu/ujs';
```

#### Create a registry instance

```javascript
const registry = Registry.from < any > { foo: 123, bar: { foo1: 'bar1', foo2: 'bar2' } };

// OR const registry = Registry.from(); // the original data = {}
```

#### registry.get<T>(path: string, defaultValue?: any, filter?: string | string[]): T

```javascript
registry.get('foo'); // It returns: 123
registry.get('bar.foo2'); // It returns: 'bar2'

// Defaults value if not exists, defaults to undefined
registry.get('bar.foo3'); // It returns: undefined
registry.get('bar.foo3', '1'); // It returns: '1'
```

#### Get and transform to the value to specific types (see [Transform](Transform.md))

```javascript
registry.get('foo', undefined, 'string'); // It returns: '123'
registry.get('foo', undefined, ['boolean', 'string']); // It returns: 'true'

// The transform will be ignored if has any default value
registry.get('bar.foo3', 1, 'string'); // It returns: 1
```

#### set(path: string, value: any, validate?: boolean): Registry

```javascript
registry.set('animal.list', ['dog', 'cat']);
registry.get('animal.list'); // It returns: ['dog', 'cat']
registry.get('animal.list.0'); // It returns: 'dog'
registry.get('animal.list.1'); // It returns: 'cat'

// Re-init the path value
registry.set('animal', ['dog', 'cat', 'tiger']);
registry.get('animal.list'); // It returns: undefined
registry.get('animal'); // It returns: ['dog', 'cat', 'tiger']
registry.get('animal.2'); // It returns: 'tiger'
```

#### has(path: string): boolean

```javascript
registry.has('animal'); // It returns: true
registry.has('animal.list'); // It returns: false
registry.has('animal.2'); // It returns: true
```

#### is(path: string, compareValue?: any): boolean

```javascript
registry.is('animal.2', 'cat'); // It returns: false
registry.is('animal.2', 'tiger'); // It returns: true

// Auto transfrom to boolean if the compareValue is not provided
registry.is('animal.2'); // It returns: true

// registry.get('animal.3') => undefined -> false
registry.is('animal.3'); // It returns: false
```

#### Extract data

```javascript
// Return the object data
registry.valueOf();
```

#### pick(paths: string[] | string): Registry

```javascript
registry.pick('bar.foo2').has('foo'); // It returns: false
registry.pick('bar.foo2').has('bar.foo1'); // It returns: false
registry.pick('bar.foo2').has('bar.foo2'); // It returns: true
```

#### omit(paths: string[] | string): Registry

```javascript
registry.omit('bar.foo2').has('bar.foo2'); // It returns: false
```

#### clone(): Registry

```javascript
const clone = registry.clone();
clone.set('foo', 456);
clone.get('foo'); // It returns: 456
registry.get('foo'); // It returns: 123
```

#### extends(data: any, validate?: boolean): Registry

```javascript
registry.extends({ bar: { foo3: 'bar3' }, foo2: 456 });
registry.get('foo2'); // It returns: 456
registry.get('bar.foo1'); // It returns: 'bar1'
registry.get('bar.foo3'); // It returns: 'bar3'
registry.extends({ bar: 456, fn: () => 1 });
registry.get('bar'); // It returns: 456
registry.isValidData(); // It returns: false
```

#### merge(data: any, validate?: boolean): Registry => @deprecated use extends instead

```javascript

```

#### parse(data?: any, options?: { validate?: boolean; clone?: boolean }): Registry

```javascript
// Parse the data to Array or Flat Object and override the current data
registry.parse([1, 'foo', 2, 'bar', { foo: 'bar' }]);
registry.get('[0]'); // It returns: 1
registry.get('[1]'); // It returns: 'foo'

registry.set('[3][0]', { num: 123 });
registry.get('[3][0].num'); // It returns: 123
registry.get('[4].foo'); // It returns: 'bar'

registry.parse({ array: registry.valueOf() });
registry.get('array[3][0].num'); // It returns: 123

registry.remove('array[4].foo');
registry.has('array[4].foo'); // It returns: false
```

#### isCached(path: string): boolean

```javascript
registry.set('array[4].foo', 456);
registry.get('array[4].foo');
registry.isCached('array[4].foo'); // It returns: true

registry.set('array[4]', 456);
registry.isCached('array[4].foo'); // It returns: false
```

#### initPathValue<T>(path: string, value: T, validate?: boolean): T

```javascript
// Init and returns the property value if it isn't set yet
registry.parse({});
registry.initPathValue('foo', 'bar');
registry.get('foo'); // It returns: 'bar'

// The value will not change because the property has already init
registry.initPathValue('foo', 'bar2');
registry.get('foo'); // It returns: 'bar'

// Init deep property
registry.initPathValue('animal.list', ['dog', 'cat']);
registry.get('animal.list'); // It returns: ['dog', 'cat']

// Try to re-init
registry.initPathValue('animal.list', ['tiger']);
registry.get('animal.list'); // It returns: ['dog', 'cat']
```

#### validate(data?: any): Registry | throw RegistryDataError

```javascript
// No function value
registry.parse({ foo: () => {} }).validate(); // Throw an exception which instance of RegistryDataError

// No Object<key, value> pair value
registry.parse({ foo: new Map(), bar: new Set() }).validate(); // Throw an exception which instance of RegistryDataError

// Deep array/object
Registry.from({ foo: new Map(), bar: new Set() }).validate(); // Throw an exception which instance of RegistryDataError
Registry.from([{ foo: 1 }, { bar: { func: () => {} } }]).validate(); // Throw an exception which instance of RegistryDataError

// isValidData(data?: any): boolean
Registry.from([{ foo: 1 }, { bar: { bar2: 123 } }]).isValidData(); // It returns: true
Registry.from([{ foo: 1 }, { bar: { func: () => {} } }]).isValidData(); // It returns: false
```

#### watch(paths: string[] | string, callback: EventHandler['handler'])

```javascript
// Watching the modified properties
registry.watch('animal.list', (newVal, prevVal) => console.log({ newVal, prevVal }));
registry.set('animal.list', ['dog', 'cat', 'tiger']);
```

#### Consistent mode: read only, throw RegistryConsistentError on the no exists path

```javascript
const consistent = Registry.from({ foo: 'bar' }, { consistent: true });
consistent.set('foo', 123); // Throw an exception which instance of RegistryConsistentError
consistent.remove('foo'); // Throw an exception which instance of RegistryConsistentError
```

#### isEmpty(): boolean

```javascript
// Check the registry data is empty or not
Registry.from({}).isEmpty(); // It returns: true
Registry.from([]).isEmpty(); // It returns: true
Registry.from({ foo: 'bar' }).isEmpty(); // It returns: false
Registry.from([0]).isEmpty(); // It returns: false
```
