import { uuid, hash, clone, extendsObject, excludeProps, sum, truncate, union, first, last, chunk } from '../../src';

it('Util Func', () => {
   // Hash
   expect(uuid().length).toEqual(36);
   expect(hash('', 'md5').length).toEqual(32);

   // Clone
   const foo = { bar: 123 };
   const foo2 = clone<typeof foo>(foo);
   foo2.bar = 456;
   expect(foo.bar).toEqual(123);
   expect(foo2.bar).toEqual(456);

   // Extends object
   const obj = extendsObject(foo, foo2, { bar2: { num: 789 } }, { bar2: { num2: 91011 } });
   expect(obj).toHaveProperty('bar2.num', 789);
   expect(obj).toHaveProperty('bar2.num2', 91011);

   // Exclude props
   excludeProps(obj, ['bar']);
   expect(obj.bar).toBeUndefined();

   // Sum
   expect(sum([1, 2, 3])).toEqual(6);
   expect(sum([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'foo' })).toEqual(4);
   expect(sum([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'bar' })).toEqual(2);

   // Truncate
   expect(truncate('hi-diddly-ho there, neighborino', 19)).toEqual('hi-diddly-ho there,...');

   // Union
   expect(union([2, 3], [1, 2], 4, [5, 7], 7)).toEqual([2, 3, 1, 4, 5, 7]);
   expect(union({ foo: 123 }, { foo: 123 }, { bar: 456 })).toEqual([{ foo: 123 }, { bar: 456 }]);

   // First & Last
   expect(first([1, 2, 3])).toEqual(1);
   expect(last([1, 2, 3])).toEqual(3);
   expect(last([])).toEqual(undefined);

   // Chunk
   expect(chunk(['a', 'b', 'c', 'd'])).toEqual([['a'], ['b'], ['c'], ['d']]);
   expect(chunk(['a', 'b', 'c', 'd'], 2)).toEqual([
      ['a', 'b'],
      ['c', 'd'],
   ]);
   expect(chunk(['a', 'b', 'c', 'd'], 3)).toEqual([['a', 'b', 'c'], ['d']]);
});
