import { Obj } from '../../src';

it('Core Object', () => {
   // # pick<T extends object>(source: T, props: string | string[])
   expect(Obj.pick({ foo: 1, bar: 2 }, ['foo'])).toMatchObject({ foo: 1 });
   expect(Obj.pick({ foo: 1, bar: 2 }, ['bar'])).toMatchObject({ bar: 2 });
   expect(Obj.pick({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, ['deep'])).toMatchObject({ deep: { foo: 123, bar: 456 } });
   expect(Obj.pick({ foo: 1, bar: 2, deep: { foo: 123 } }, ['deep.foo'])).toMatchObject({ deep: { foo: 123 } });

   // # omit<T extends object>(source: T, props: string | string[])
   expect(Obj.omit({ foo: 1, bar: 2 }, ['foo'])).toMatchObject({ bar: 2 });
   expect(Obj.omit({ foo: 1, bar: 2 }, ['bar'])).toMatchObject({ foo: 1 });
   expect(Obj.omit({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, ['deep'])).toMatchObject({ foo: 1, bar: 2 });

   const fromObj = { foo: 1, bar: 2, deep: { foo: 123, bar: 456 } };
   expect(Obj.omit(fromObj, ['deep.foo'])).toMatchObject({ foo: 1, bar: 2, deep: { bar: 456 } });

   // # contains(source: object, target: object | string)
   expect(Obj.contains({ foo: 1, bar: 2 }, { foo: 1, bar: 2 })).toBeTruthy();
   expect(Obj.contains({ foo: 1, bar: 2 }, { foo: 1 })).toBeTruthy();
   expect(Obj.contains({ foo: 1, bar: 2 }, { bar: 2 })).toBeTruthy();
   expect(Obj.contains({ foo: 1, bar: 2 }, { bar: '2' })).toBeFalsy();
   expect(Obj.contains({ foo: 1, bar: 2 }, { deep: { foo: 123, bar: 456 } })).toBeFalsy();
   expect(Obj.contains({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, { deep: { foo: 123, bar: 456 } })).toBeTruthy();

   // ## From the object instance
   expect(Obj.from({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }).contains({ deep: { foo: 123, bar: 456 } })).toBeTruthy();
   expect(Obj.from({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }).contains('deep.bar')).toBeTruthy();

   // # excludes<T extends object, K extends keyof T>(target: T, props: K[] | K): Omit<T, K>
   const target = { foo: 1, bar: 2, deep: { foo: 123, bar: 456 } };
   Obj.excludes(target, 'bar');
   expect(target).not.toHaveProperty('bar');

   Obj.excludes(target, ['deep']);
   expect(target).toMatchObject({ foo: 1 });

   // # extends(target: object, ...sources: object[])
   const obj = Obj.extends({ foo: 1, bar: 2 }, { bar2: { num: 789 } }, { bar2: { num2: 91011 } });
   expect(obj).toHaveProperty('bar2.num', 789);
   expect(obj).toHaveProperty('bar2.num2', 91011);

   // ## From the object instance
   const obj2 = Obj.from({ foo: 1, bar: 2 });
   expect(obj2.extends({ bar2: { num: 789 } }, { bar2: { num2: 91011 } })).toHaveProperty('bar2.num2', 91011);

   // # reset<T extends Record<string, any>>(newData?: T) => (alias from Util.resetObject)
   expect(Obj.reset({ foo: 1, bar: 2 })).toMatchObject({});
   expect(Obj.reset({ foo: 1, bar: 2 }, { new: 'Year' })).toMatchObject({ new: 'Year' });

   // ## From the object instance
   expect(Obj.from({ foo: 1, bar: 2 }).reset({ new: 'Year' })).toMatchObject({ new: 'Year' });

   // # initPropValue<T>(o: Record<string, any>, prop: string, value: T) : T
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
