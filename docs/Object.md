## Object

### Usage

```javascript
import { Obj } from '@maivubc/ujs';
```

#### pick<T extends object>(source: T, props: string | string[])

```javascript
Obj.pick({ foo: 1, bar: 2 }, ['foo']); // It returns: { foo: 1 }
Obj.pick({ foo: 1, bar: 2 }, ['bar']); // It returns: { bar: 2 }
Obj.pick({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, ['deep']); // It returns: { deep: { foo: 123, bar: 456 } }
Obj.pick({ foo: 1, bar: 2, deep: { foo: 123 } }, ['deep.foo']); // It returns: { deep: { foo: 123 } }
```

#### omit<T extends object>(source: T, props: string | string[])

```javascript
Obj.omit({ foo: 1, bar: 2 }, ['foo']); // It returns: { bar: 2 }
Obj.omit({ foo: 1, bar: 2 }, ['bar']); // It returns: { foo: 1 }
Obj.omit({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, ['deep']); // It returns: { foo: 1, bar: 2 }

const fromObj = { foo: 1, bar: 2, deep: { foo: 123, bar: 456 } };
Obj.omit(fromObj, ['deep.foo']); // It returns: { foo: 1, bar: 2, deep: { bar: 456 } }
```

#### contains(source: object, target: object | string)

```javascript
Obj.contains({ foo: 1, bar: 2 }, { foo: 1, bar: 2 }); // It returns: true
Obj.contains({ foo: 1, bar: 2 }, { foo: 1 }); // It returns: true
Obj.contains({ foo: 1, bar: 2 }, { bar: 2 }); // It returns: true
Obj.contains({ foo: 1, bar: 2 }, { bar: '2' }); // It returns: false
Obj.contains({ foo: 1, bar: 2 }, { deep: { foo: 123, bar: 456 } }); // It returns: false
Obj.contains({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, { deep: { foo: 123, bar: 456 } }); // It returns: true

// From the object instance
Obj.from({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }).contains({ deep: { foo: 123, bar: 456 } }); // It returns: true
Obj.from({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }).contains('deep.bar'); // It returns: true
```

#### excludes<T extends object, K extends keyof T>(target: T, props: K[] | K): Omit<T, K>

```javascript
const target = { foo: 1, bar: 2, deep: { foo: 123, bar: 456 } };
Obj.excludes(target, 'bar');
target; // It returns: [ROOT].'bar' === undefined

Obj.excludes(target, ['deep']);
target; // It returns: { foo: 1 }
```

#### extends(target: object, ...sources: object[])

```javascript
const obj = Obj.extends({ foo: 1, bar: 2 }, { bar2: { num: 789 } }, { bar2: { num2: 91011 } });
obj; // It returns: [ROOT].'bar2.num' ===  789
obj; // It returns: [ROOT].'bar2.num2' ===  91011

// From the object instance
const obj2 = Obj.from({ foo: 1, bar: 2 });
obj2.extends({ bar2: { num: 789 } }, { bar2: { num2: 91011 } }); // It returns: [ROOT].'bar2.num2' ===  91011
```

#### reset<T extends Record<string, any>>(newData?: T)

```javascript
Obj.reset({ foo: 1, bar: 2 }); // It returns: {}
Obj.reset({ foo: 1, bar: 2 }, { new: 'Year' }); // It returns: { new: 'Year' }

// From the object instance
Obj.from({ foo: 1, bar: 2 }).reset({ new: 'Year' }); // It returns: { new: 'Year' }
```

#### initPropValue<T>(o: Record<string, any>, prop: string, value: T) : T

```javascript
// Init and returns the property value if it isn't set yet
const o: Record<string, any> = {};
Obj.initPropValue(o, 'foo', 'bar');
o; // It returns: { foo: 'bar' }

```

#### The value will not change because the property has already init

```javascript
Obj.initPropValue(o, 'foo', 'bar2');
o; // It returns: { foo: 'bar' }
```

#### Init deep property

```javascript
Obj.initPropValue(o, 'animal.list', ['dog', 'cat']);
o.animal.list; // It returns: ['dog', 'cat']

// Try to re-init
Obj.initPropValue(o, 'animal.list', ['tiger']);
o.animal.list; // It returns: ['dog', 'cat']
```
