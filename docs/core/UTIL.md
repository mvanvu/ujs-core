## UTIL

### Usage

```javascript
import { Util } from '@maivubc/ujs';
```

### Clone (any type)

```javascript
const foo = { bar: 123 };
const foo2 = Util.clone(foo);
foo2.bar = 456;
foo.bar; // It returns: 123
foo2.bar; // It returns: 456
const fn = () => 1;
Util.clone(fn); // It returns: fn
```

### Reset object and assign new properties (maybe)

```javascript
Util.resetObject({ foo: 1, bar: 2 }, { foo: 'bar' }); // It returns: [ROOT].'foo' ===  'bar'
```

### Sort

```javascript
Util.sort(['March', 'Jan', 'Feb', 'Dec']); // It returns: ['Dec', 'Feb', 'Jan', 'March']
Util.sort([1, 30, 4, 21, 100000]); // It returns: [1, 4, 21, 30, 100000]
Object.keys(Util.sort({ foo: 10, bar: 20 })); // It returns: ['bar', 'foo']

const sorted = Util.sort(Array({ foo: 10, bar: 20 }, { foo: 5, bar: 10 }), { key: 'foo' });
sorted; // It returns: Array({ foo: 5, bar: 10 }, { foo: 10, bar: 20 })
```

### Base name

```javascript
Util.baseName('/www/site/home.html'); // It returns: 'home.html'
Util.baseName('/www/site/home.html', '.html'); // It returns: 'home'
Util.baseName('/some/path/'); // It returns: 'path'
```

### Dir name

```javascript
Util.dirName('/etc/passwd'); // It returns: '/etc'
Util.dirName('/some/path/to/'); // It returns: '/some/path'
```
