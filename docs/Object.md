## Object

### Usage

```javascript
import { Obj } from '@mvanvu/ujs';
```

#### pick<T extends object, K extends Path<T>>(source: T, props: K | K[]): NestedPick<T, K>

```javascript
Obj.pick({ foo: 1, bar: 2 }, ['foo']); // It returns: { foo: 1 }
Obj.pick({ foo: 1, bar: 2 }, ['bar']); // It returns: { bar: 2 }
Obj.pick({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, ['deep']); // It returns: { deep: { foo: 123, bar: 456 } }
Obj.pick({ foo: 1, bar: 2, deep: { foo: 123 } }, ['deep.foo']); // It returns: { deep: { foo: 123 } }
```

#### omit<T extends object, K extends Path<T>>(source: T, props: K | K[]): NestedOmit<T, K>

```javascript
Obj.omit({ foo: 1, bar: 2 }, ['foo']); // It returns: { bar: 2 }
Obj.omit({ foo: 1, bar: 2 }, ['bar']); // It returns: { foo: 1 }
Obj.omit({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, ['deep']); // It returns: { foo: 1, bar: 2 }

const fromObj = { foo: 1, bar: 2, deep: { foo: 123, bar: { foo2: 'foo2', baz: 456 } } };
Obj.omit(fromObj, ['deep.foo']); // It returns: { foo: 1, bar: 2, deep: { bar: { baz: 456 } } }
```

#### contains(source: object, target: object | string): boolean

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

#### extends<T extends object, O extends object[]>(target: T, ...sources: O): ExtendsObjects<T, O>

```javascript
const obj = Obj.extends({ foo: 1, bar: 2 }, { bar2: { num1: 1 } }, { bar2: { num2: 2 } }, { bool: true });
obj; // It returns: [ROOT].'bar2.num1' ===  1
obj; // It returns: [ROOT].'bar2.num2' ===  2
obj; // It returns: [ROOT].'bool' ===  true

// From the object instance
const obj2 = Obj.from({ foo: 1, bar: 2 });
obj2.extends({ bar2: { num: 789 } }, { bar2: { num2: 91011 } }); // It returns: [ROOT].'bar2.num2' ===  91011
```

#### reset<T extends undefined | null | object>(obj: object, newData?: T): ResetObject<T>

```javascript
Obj.reset({ foo: 1, bar: 2 }); // It returns: {}
Obj.reset({ foo: 1, bar: 2 }, { new: 'Year' }); // It returns: { new: 'Year' }

// From the object instance
Obj.from({ foo: 1, bar: 2 }).reset({ new: 'Year' }); // It returns: { new: 'Year' }
```

#### InitPropValue<T>(o: Record<ObjectKey, any>, prop: string, value: T): T

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
const objs = { ...new Obj({ foo: 'bar' }) };

console.log({ objs });
```
