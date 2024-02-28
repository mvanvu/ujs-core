## OBJECT

### Usage

```javascript
import { Obj } from '@maivubc/ujs';
```

### Pick

```javascript
Obj.pick({ foo: 1, bar: 2 }, ['foo']); // It returns: { foo: 1 }
Obj.pick({ foo: 1, bar: 2 }, ['bar']); // It returns: { bar: 2 }
Obj.pick({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, ['deep']); // It returns: { deep: { foo: 123, bar: 456 } }
Obj.pick({ foo: 1, bar: 2, deep: { foo: 123 } }, ['deep.foo']); // It returns: { deep: { foo: 123 } }
```

### Omit

```javascript
Obj.omit({ foo: 1, bar: 2 }, ['foo']); // It returns: { bar: 2 }
Obj.omit({ foo: 1, bar: 2 }, ['bar']); // It returns: { foo: 1 }
Obj.omit({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, ['deep']); // It returns: { foo: 1, bar: 2 }

const fromObj = { foo: 1, bar: 2, deep: { foo: 123, bar: 456 } };
Obj.omit(fromObj, ['deep.foo']); // It returns: { foo: 1, bar: 2, deep: { bar: 456 } }
```

### Contains

```javascript
Obj.contains({ foo: 1, bar: 2 }, { foo: 1, bar: 2 }); // It returns: true
Obj.contains({ foo: 1, bar: 2 }, { foo: 1 }); // It returns: true
Obj.contains({ foo: 1, bar: 2 }, { bar: 2 }); // It returns: true
Obj.contains({ foo: 1, bar: 2 }, { bar: '2' }); // It returns: false
Obj.contains({ foo: 1, bar: 2 }, { deep: { foo: 123, bar: 456 } }); // It returns: false
Obj.contains({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, { deep: { foo: 123, bar: 456 } }); // It returns: true
Obj.from({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }).contains({ deep: { foo: 123, bar: 456 } }); // It returns: true
Obj.from({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }).contains('deep.bar'); // It returns: true
```

### Excludes

```javascript
const target = { foo: 1, bar: 2, deep: { foo: 123, bar: 456 } };
Obj.excludes(target, 'bar');
target; // It returns: [ROOT].'bar' === undefined

Obj.excludes(target, ['deep']);
target; // It returns: { foo: 1 }
```

### Extends

```javascript
const obj = Obj.extends({ foo: 1, bar: 2 }, { bar2: { num: 789 } }, { bar2: { num2: 91011 } });
obj; // It returns: [ROOT].'bar2.num' ===  789
obj; // It returns: [ROOT].'bar2.num2' ===  91011

const obj2 = Obj.from({ foo: 1, bar: 2 });
obj2.extends({ bar2: { num: 789 } }, { bar2: { num2: 91011 } }); // It returns: [ROOT].'bar2.num2' ===  91011
```

### Reset

```javascript
Obj.from({ foo: 1, bar: 2 }).reset(); // It returns: {}
```
