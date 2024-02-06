import { Registry } from '../../src';

it('Util Registry', () => {
   const registry = Registry.create({ foo: 123, bar: { foo1: 'bar1', foo2: 'bar2' } });

   // Pick
   expect(registry.pick('bar.foo2').has('foo')).toBeFalsy();
   expect(registry.pick('bar.foo2').has('bar.foo1')).toBeFalsy();
   expect(registry.pick('bar.foo2').has('bar.foo2')).toBeTruthy();

   // Omit
   expect(registry.omit('bar.foo2').has('bar.foo2')).toBeFalsy();

   // Clone
   const clone = registry.clone();
   clone.set('foo', 456);
   expect(clone.get('foo')).toEqual(456);
   expect(registry.get('foo')).toEqual(123);

   // Merge
   registry.merge({ bar: { foo3: 'bar3' }, foo2: 456 });
   expect(registry.get('foo2')).toEqual(456);
   expect(registry.get('bar.foo1')).toEqual('bar1');
   expect(registry.get('bar.foo3')).toEqual('bar3');
   registry.merge({ bar: 456 });
   expect(registry.get('bar')).toEqual(456);

   // Array registry
   registry.parse([1, 'foo', 2, 'bar', { foo: 'bar' }]);
   expect(registry.get('0')).toEqual(1);
   expect(registry.get('1')).toEqual('foo');

   registry.set('3.0', { num: 123 });
   expect(registry.get('3.0.num')).toEqual(123);
   expect(registry.get('4.foo')).toEqual('bar');

   registry.parse({ array: registry.toObject() });
   expect(registry.get('array.3.0.num')).toEqual(123);

   registry.remove('array.4.foo');
   expect(registry.has('array.4.foo')).toBeFalsy();

   // Cached
   registry.set('array.4.foo', 456);
   expect(registry.has('array.4.foo')).toBeTruthy();
});
