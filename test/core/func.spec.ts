import { clone, resetObject, sort, baseName, dirName } from '../../src';

it('Core Func', () => {
   // Clone
   const foo = { bar: 123 };
   const foo2 = clone(foo);
   foo2.bar = 456;
   expect(foo.bar).toEqual(123);
   expect(foo2.bar).toEqual(456);

   // Reset object
   expect(resetObject({ foo: 1, bar: 2 }, { foo: 'bar' })).toHaveProperty('foo', 'bar');

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

   // Base name
   expect(baseName('/www/site/home.htm', '.htm')).toEqual('home');
   expect(baseName('/some/path/')).toEqual('path');

   // Dir name
   expect(dirName('/etc/passwd')).toEqual('/etc');
   expect(dirName('/some/path/to/')).toEqual('/some/path');
});
