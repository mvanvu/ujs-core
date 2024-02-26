import { Util } from '../../src';

it('Core Util', () => {
   // Clone
   const foo = { bar: 123 };
   const foo2 = Util.clone(foo);
   foo2.bar = 456;
   expect(foo.bar).toEqual(123);
   expect(foo2.bar).toEqual(456);
   const fn = () => 1;
   expect(Util.clone(fn)).toEqual(fn);

   // Reset object
   expect(Util.resetObject({ foo: 1, bar: 2 }, { foo: 'bar' })).toHaveProperty('foo', 'bar');

   // Sort
   expect(Util.sort(['March', 'Jan', 'Feb', 'Dec'])).toEqual(['Dec', 'Feb', 'Jan', 'March']);
   expect(Util.sort([1, 30, 4, 21, 100000])).toEqual([1, 4, 21, 30, 100000]);
   expect(
      Util.sort(
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
   expect(Object.keys(Util.sort({ foo: 10, bar: 20 }))).toEqual(['bar', 'foo']);

   // Base name
   expect(Util.baseName('/www/site/home.html')).toEqual('home.html');
   expect(Util.baseName('/www/site/home.html', '.html')).toEqual('home');
   expect(Util.baseName('/some/path/')).toEqual('path');

   // Dir name
   expect(Util.dirName('/etc/passwd')).toEqual('/etc');
   expect(Util.dirName('/some/path/to/')).toEqual('/some/path');
});
