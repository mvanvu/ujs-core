import { Obj } from '../../src';

it('Core Object', () => {
   // # pick<T extends object, K extends Path<T>>(source: T, props: K | K[]): NestedPick<T, K>
   expect(Obj.pick({ foo: 1, bar: 2 }, ['foo'])).toMatchObject({ foo: 1 });
   expect(Obj.pick({ foo: 1, bar: 2 }, ['bar'])).toMatchObject({ bar: 2 });
   expect(Obj.pick({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, ['deep'])).toMatchObject({ deep: { foo: 123, bar: 456 } });
   expect(Obj.pick({ foo: 1, bar: 2, deep: { foo: 123 } }, ['deep.foo'])).toMatchObject({ deep: { foo: 123 } });

   // # omit<T extends object, K extends Path<T>>(source: T, props: K | K[]): NestedOmit<T, K>
   expect(Obj.omit({ foo: 1, bar: 2 }, ['foo'])).toMatchObject({ bar: 2 });
   expect(Obj.omit({ foo: 1, bar: 2 }, ['bar'])).toMatchObject({ foo: 1 });
   expect(Obj.omit({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, ['deep'])).toMatchObject({ foo: 1, bar: 2 });

   const fromObj = { foo: 1, bar: 2, deep: { foo: 123, bar: { foo2: 'foo2', baz: 456 } } };
   expect(Obj.omit(fromObj, ['deep.foo'])).toMatchObject({ foo: 1, bar: 2, deep: { bar: { baz: 456 } } });

   // # contains(source: object, target: object | string): boolean
   expect(Obj.contains({ foo: 1, bar: 2 }, { foo: 1, bar: 2 })).toBeTruthy();
   expect(Obj.contains({ foo: 1, bar: 2 }, { foo: 1 })).toBeTruthy();
   expect(Obj.contains({ foo: 1, bar: 2 }, { bar: 2 })).toBeTruthy();
   expect(Obj.contains({ foo: 1, bar: 2 }, { bar: '2' })).toBeFalsy();
   expect(Obj.contains({ foo: 1, bar: 2 }, { deep: { foo: 123, bar: 456 } })).toBeFalsy();
   expect(Obj.contains({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, { deep: { foo: 123, bar: 456 } })).toBeTruthy();

   // ## From the object instance
   expect(Obj.from({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }).contains({ deep: { foo: 123, bar: 456 } })).toBeTruthy();
   expect(Obj.from({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }).contains('deep.bar')).toBeTruthy();

   // # extends<T extends object, O extends object[]>(target: T, ...sources: O): ExtendsObjects<T, O>
   const obj = Obj.extends({ foo: 1, bar: 2 }, { bar2: { num1: 1 } }, { bar2: { num2: 2 } }, { bool: true });
   expect(obj).toHaveProperty('bar2.num1', 1);
   expect(obj).toHaveProperty('bar2.num2', 2);
   expect(obj).toHaveProperty('bool', true);

   // ## From the object instance
   const obj2 = Obj.from({ foo: 1, bar: 2 });
   expect(obj2.extends({ bar2: { num: 789 } }, { bar2: { num2: 91011 } })).toHaveProperty('bar2.num2', 91011);

   // # reset<T extends undefined | null | object>(obj: object, newData?: T): ResetObject<T>
   expect(Obj.reset({ foo: 1, bar: 2 })).toMatchObject({});
   expect(Obj.reset({ foo: 1, bar: 2 }, { new: 'Year' })).toMatchObject({ new: 'Year' });

   // ## From the object instance
   expect(Obj.from({ foo: 1, bar: 2 }).reset({ new: 'Year' })).toMatchObject({ new: 'Year' });

   // # InitPropValue<T>(o: Record<ObjectKey, any>, prop: string, value: T): T
   // ## Init and returns the property value if it isn't set yet
   const o: Record<string, any> = {};
   Obj.initPropValue(o, 'foo', 'bar');
   expect(o).toMatchObject({ foo: 'bar' });

   // # The value will not change because the property has already init
   Obj.initPropValue(o, 'foo', 'bar2');
   expect(o).toMatchObject({ foo: 'bar' });

   // # Init deep property
   Obj.initPropValue(o, 'animal.list', ['dog', 'cat']);
   expect(o.animal.list).toEqual(['dog', 'cat']);

   // ## Try to re-init
   Obj.initPropValue(o, 'animal.list', ['tiger']);
   expect(o.animal.list).toEqual(['dog', 'cat']);
});
