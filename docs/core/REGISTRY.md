## REGISTRY

### Usage

```javascript
import { Registry, RegistryDataError } from '@maivubc/ujs';
```

### Create a registry instance

```javascript
const registry = Registry.from({ foo: 123, bar: { foo1: 'bar1', foo2: 'bar2' } });
```

### Pick

```javascript
registry.pick('bar.foo2').has('foo'); // It returns: false
registry.pick('bar.foo2').has('bar.foo1'); // It returns: false
registry.pick('bar.foo2').has('bar.foo2'); // It returns: true
```

### Omit

```javascript
registry.omit('bar.foo2').has('bar.foo2'); // It returns: false
```

### Clone

```javascript
const clone = registry.clone();
clone.set('foo', 456);
clone.get('foo'); // It returns: 456
registry.get('foo'); // It returns: 123
```

### Merge

```javascript
registry.merge({ bar: { foo3: 'bar3' }, foo2: 456 });
registry.get('foo2'); // It returns: 456
registry.get('bar.foo1'); // It returns: 'bar1'
registry.get('bar.foo3'); // It returns: 'bar3'
registry.merge({ bar: 456, fn: () => 1 });
registry.get('bar'); // It returns: 456
registry.isValidData(); // It returns: false
```

### Array Registry

```javascript
registry.parse([1, 'foo', 2, 'bar', { foo: 'bar' }]);
registry.get('0'); // It returns: 1
registry.get('1'); // It returns: 'foo'

registry.set('3.0', { num: 123 });
registry.get('3.0.num'); // It returns: 123
registry.get('4.foo'); // It returns: 'bar'

registry.parse({ array: registry.valueOf() });
registry.get('array.3.0.num'); // It returns: 123

registry.remove('array.4.foo');
registry.has('array.4.foo'); // It returns: false
```

### Caching

```javascript
registry.set('array.4.foo', 456);
registry.get('array.4.foo');
registry.isCached('array.4.foo'); // It returns: true

registry.set('array.4', 456);
registry.isCached('array.4.foo'); // It returns: false
```

### Validate

```javascript
// No function value
registry.parse({ foo: () => {} }).validate(); // Throw an exception which instance of RegistryDataError

// No Object<key, value> pair value
registry.parse({ foo: new Map(), bar: new Set() }).validate(); // Throw an exception which instance of RegistryDataError

// Deep array/object
Registry.from({ foo: new Map(), bar: new Set() }).validate(); // Throw an exception which instance of RegistryDataError
Registry.from([{ foo: 1 }, { bar: { func: () => {} } }]).validate(); // Throw an exception which instance of RegistryDataError
const reg = Registry.from([{ foo: 1 }, { bar: { func: () => {} } }]);

// Check is valid
Registry.from([{ foo: 1 }, { bar: { bar2: 123 } }]).isValidData(); // It returns: true
Registry.from([{ foo: 1 }, { bar: { func: () => {} } }]).isValidData(); // It returns: false
```
