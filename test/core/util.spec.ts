import { Util } from '../../src';

it('Core Util', async () => {
   // # Clone (any type and ignore reference pointer)
   const foo = { bar: 123 };
   const foo2 = Util.clone(foo);
   foo2.bar = 456;
   expect(foo.bar).toEqual(123);
   expect(foo2.bar).toEqual(456);
   const fn = () => 1;
   expect(Util.clone(fn)).toEqual(fn);

   // # Reset object
   expect(Util.resetObject({ foo: 1, bar: 2 }, { foo: 'bar' })).toMatchObject({});

   // ## Reset & assign new properties
   expect(Util.resetObject({ foo: 1, bar: 2 }, { foo: 'bar' })).toMatchObject({ foo: 'bar' });

   // # Callback(fn, params: any[], instanceThis?: any): an async function to call if the value is callable
   // ## Call a none function, just do nothing and return it
   expect(await Util.callback('Im not callable')).toEqual('Im not callable');

   // ## Call a function
   expect(await Util.callback(() => 'Hi!')).toEqual('Hi!');

   // ## Call a function with arguments
   expect(await Util.callback((name: string, age: number) => `I'm ${name}, ${age} years old!`, ['Yu', 25])).toEqual(`I'm Yu, 25 years old!`);

   // ## Call a function with this instance
   // ## Note: this instance can't call with arrow function
   function whoAmI() {
      return this;
   }

   expect(await Util.callback(whoAmI, [], 'Iron man')).toEqual('Iron man');

   // ## When the callback is an instance of Promise, then the arguments and this instance will be ignored
   expect(await Util.callback(new Promise((resolve) => resolve('Im here')))).toEqual('Im here');

   // # Sort
   expect(Util.sort(['March', 'Jan', 'Feb', 'Dec'])).toEqual(['Dec', 'Feb', 'Jan', 'March']);
   expect(Util.sort([1, 30, 4, 21, 100000])).toEqual([1, 4, 21, 30, 100000]);
   expect(Object.keys(Util.sort({ foo: 10, bar: 20 }))).toEqual(['bar', 'foo']);

   const sorted = Util.sort(Array({ foo: 10, bar: 20 }, { foo: 5, bar: 10 }), { key: 'foo' });
   expect(sorted).toEqual(Array({ foo: 5, bar: 10 }, { foo: 10, bar: 20 }));

   // # Base name
   expect(Util.baseName('/www/site/home.html')).toEqual('home.html');
   expect(Util.baseName('/www/site/home.html', '.html')).toEqual('home');
   expect(Util.baseName('/some/path/')).toEqual('path');

   // # Dir name
   expect(Util.dirName('/etc/passwd')).toEqual('/etc');
   expect(Util.dirName('/some/path/to/')).toEqual('/some/path');
});
