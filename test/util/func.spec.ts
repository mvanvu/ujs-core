import {
   uuid,
   hash,
   clone,
   extendsObject,
   excludeProps,
   sum,
   truncate,
   union,
   first,
   last,
   chunk,
   repeat,
   resetObject,
   sort,
} from '../../src';

it('Util Func', () => {
   // Hash
   const rawStr = 'Hello World!';
   expect(uuid().length).toEqual(36);
   expect(hash(rawStr, 'md5')).toEqual('ed076287532e86365e841e92bfc50d8c');
   expect(hash(rawStr, 'sha1')).toEqual('2ef7bde608ce5404e97d5f042f95f89f1c232871');
   expect(hash(rawStr, 'sha256')).toEqual('7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069');

   // Clone
   const foo = { bar: 123 };
   const foo2 = clone(foo);
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

   // Repeat
   expect(repeat('-', 0.4)).toEqual('');
   expect(repeat('-', -1)).toEqual('');
   expect(repeat('-', 0)).toEqual('');
   expect(repeat('-', 1)).toEqual('-');
   expect(repeat('-', 2)).toEqual('--');
   expect(repeat('==', 2)).toEqual('====');

   // Reset object
   resetObject(obj, { foo: 'bar' });
   expect(foo).toHaveProperty('foo', 'bar');

   // Sort
   expect(sort(['March', 'Jan', 'Feb', 'Dec'])).toEqual(['Dec', 'Feb', 'Jan', 'March']);
   expect(sort([1, 30, 4, 21, 100000])).toEqual([1, 4, 21, 30, 100000]);
   expect(
      sort(
         [
            { foo: 10, bar: 20 },
            { foo: 5, bar: 10 },
         ],
         { key: 'foo' },
      ),
   ).toEqual([
      { foo: 5, bar: 10 },
      { foo: 10, bar: 20 },
   ]);
   expect(Object.keys(sort({ foo: 10, bar: 20 }))).toEqual(['bar', 'foo']);
});
