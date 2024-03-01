import { Registry, RegistryDataError } from '../../src';

it('Util Registry', () => {
   // # Create a registry instance
   const registry = Registry.from({ foo: 123, bar: { foo1: 'bar1', foo2: 'bar2' } });
   // ## OR const registry = Registry.from(); // the original data = {}

   // # get<T>(path: string, defaultValue?: any, filter?: string | string[]): T
   expect(registry.get('foo')).toEqual(123);
   expect(registry.get('bar.foo2')).toEqual('bar2');

   // ## Defaults value if not exists, defaults to undefined
   expect(registry.get('bar.foo3')).toEqual(undefined);
   expect(registry.get('bar.foo3', '1')).toEqual('1');

   // # Get and transform to the value to specific types (see [Transform](Transform.md))
   expect(registry.get('foo', undefined, 'string')).toEqual('123');
   expect(registry.get('foo', undefined, ['boolean', 'string'])).toEqual('true');

   // ## The transform will be ignored if has any default value
   expect(registry.get('bar.foo3', 1, 'string')).toEqual(1);

   // # set(path: string, value: any)
   registry.set('animal.list', ['dog', 'cat']);
   expect(registry.get('animal.list')).toEqual(['dog', 'cat']);
   expect(registry.get('animal.list.0')).toEqual('dog');
   expect(registry.get('animal.list.1')).toEqual('cat');

   // ## Re-init the path value
   registry.set('animal', ['dog', 'cat', 'tiger']);
   expect(registry.get('animal.list')).toEqual(undefined);
   expect(registry.get('animal')).toEqual(['dog', 'cat', 'tiger']);
   expect(registry.get('animal.2')).toEqual('tiger');

   // # has(path: string)
   expect(registry.has('animal')).toBeTruthy();
   expect(registry.has('animal.list')).toBeFalsy();
   expect(registry.has('animal.2')).toBeTruthy();

   // # is(path: string, compareValue?: any)
   expect(registry.is('animal.2', 'cat')).toBeFalsy();
   expect(registry.is('animal.2', 'tiger')).toBeTruthy();

   // ## Auto transfrom to boolean if the compareValue is not provided
   expect(registry.is('animal.2')).toBeTruthy();

   // ## registry.get('animal.3') => undefined -> false
   expect(registry.is('animal.3')).toBeFalsy();

   // # Extract data
   // ## Return the object data
   registry.valueOf();

   // # pick(paths: string[] | string)
   expect(registry.pick('bar.foo2').has('foo')).toBeFalsy();
   expect(registry.pick('bar.foo2').has('bar.foo1')).toBeFalsy();
   expect(registry.pick('bar.foo2').has('bar.foo2')).toBeTruthy();

   // # omit(paths: string[] | string)
   expect(registry.omit('bar.foo2').has('bar.foo2')).toBeFalsy();

   // # clone()
   const clone = registry.clone();
   clone.set('foo', 456);
   expect(clone.get('foo')).toEqual(456);
   expect(registry.get('foo')).toEqual(123);

   // # merge(data: any)
   registry.merge({ bar: { foo3: 'bar3' }, foo2: 456 });
   expect(registry.get('foo2')).toEqual(456);
   expect(registry.get('bar.foo1')).toEqual('bar1');
   expect(registry.get('bar.foo3')).toEqual('bar3');
   registry.merge({ bar: 456, fn: () => 1 });
   expect(registry.get('bar')).toEqual(456);
   expect(registry.isValidData()).toBeFalsy();

   // # parse(data?: any, options?: { validate?: boolean; clone?: boolean })
   // ## Parse the data to Array or Flat Object and override the current data
   registry.parse([1, 'foo', 2, 'bar', { foo: 'bar' }]);
   expect(registry.get('0')).toEqual(1);
   expect(registry.get('1')).toEqual('foo');

   registry.set('3.0', { num: 123 });
   expect(registry.get('3.0.num')).toEqual(123);
   expect(registry.get('4.foo')).toEqual('bar');

   registry.parse({ array: registry.valueOf() });
   expect(registry.get('array.3.0.num')).toEqual(123);

   registry.remove('array.4.foo');
   expect(registry.has('array.4.foo')).toBeFalsy();

   // # Caching (testing purpose)
   registry.set('array.4.foo', 456);
   registry.get('array.4.foo');
   expect(registry.isCached('array.4.foo')).toBeTruthy();

   registry.set('array.4', 456);
   expect(registry.isCached('array.4.foo')).toBeFalsy();

   // # initPathValue<T>(o: Record<string, any>, prop: string, value: T) : T
   // ## Init and returns the property value if it isn't set yet
   registry.parse({});
   registry.initPathValue('foo', 'bar');
   expect(registry.get('foo')).toEqual('bar');

   // # The value will not change because the property has already init
   registry.initPathValue('foo', 'bar2');
   expect(registry.get('foo')).toEqual('bar');

   // # Init deep property
   registry.initPathValue('animal.list', ['dog', 'cat']);
   expect(registry.get('animal.list')).toEqual(['dog', 'cat']);

   // ## Try to re-init
   registry.initPathValue('animal.list', ['tiger']);
   expect(registry.get('animal.list')).toEqual(['dog', 'cat']);

   // # Validate
   // ## No function value
   expect(() => registry.parse({ foo: () => {} }).validate()).toThrow(RegistryDataError);

   // ## No Object<key, value> pair value
   expect(() => registry.parse({ foo: new Map(), bar: new Set() }).validate()).toThrow(RegistryDataError);

   // ## Deep array/object
   expect(() => Registry.from({ foo: new Map(), bar: new Set() }).validate()).toThrow(RegistryDataError);
   expect(() => Registry.from([{ foo: 1 }, { bar: { func: () => {} } }]).validate()).toThrow(RegistryDataError);

   // ## Check is valid
   expect(Registry.from([{ foo: 1 }, { bar: { bar2: 123 } }]).isValidData()).toBeTruthy();
   expect(Registry.from([{ foo: 1 }, { bar: { func: () => {} } }]).isValidData()).toBeFalsy();
});
