import { Util, UtilRaceError } from '../../src';

it('Core Util', async () => {
   // # clone<T>(src: T): T (any type and ignore reference pointer)
   const foo = { bar: 123 };
   const foo2 = Util.clone(foo);
   foo2.bar = 456;
   expect(foo.bar).toEqual(123);
   expect(foo2.bar).toEqual(456);
   const fn = () => 1;
   expect(Util.clone(fn)).toEqual(fn);

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

   // # sort(data: any[] | object, options?: { key?: string })
   expect(Util.sort(['March', 'Jan', 'Feb', 'Dec'])).toEqual(['Dec', 'Feb', 'Jan', 'March']);
   expect(Util.sort([1, 30, 4, 21, 100000])).toEqual([1, 4, 21, 30, 100000]);
   expect(Object.keys(Util.sort({ foo: 10, bar: 20 }))).toEqual(['bar', 'foo']);

   const sorted = Util.sort(Array({ foo: 10, bar: 20 }, { foo: 5, bar: 10 }), { key: 'foo' });
   expect(sorted).toEqual(Array({ foo: 5, bar: 10 }, { foo: 10, bar: 20 }));

   // # baseName(path: string, suffix?: string)
   expect(Util.baseName('/www/site/home.html')).toEqual('home.html');
   expect(Util.baseName('/www/site/home.html', '.html')).toEqual('home');
   expect(Util.baseName('/some/path/')).toEqual('path');

   // # dirName(path: string)
   expect(Util.dirName('/etc/passwd')).toEqual('/etc');
   expect(Util.dirName('/some/path/to/')).toEqual('/some/path');

   // # async race(callback: any, maxSeconds: number) -> Run a callback in the limited time (seconds)
   // ## Run the callback in around of maximum seconds otherwise it will be thrown an instance of UtilRaceError
   expect(await Util.race('Im not callable', 1)).toEqual('Im not callable');

   // ## Throw UtilRaceError because the callback run in 2 seconds while the maximum time is 1 seconds
   const timeout = async () => {
      try {
         await Util.race(new Promise((resolve) => setTimeout(resolve, 2000)), 1);
      } catch (e) {
         return e;
      }
   };

   expect((await timeout()) instanceof UtilRaceError).toBeTruthy();

   // # Util.debug(...entries: any[])
   // ## Log the variable with deep properties and color
   Util.debug({ user: { id: 1, ua: 'admin', age: 30, major: ['Full stack developer'] } });

   // # Util.debugDev(...entries: any[])
   // ## The same Util.debug but only log in NodeJS and process?.env?.NODE_ENV === 'development'
});
