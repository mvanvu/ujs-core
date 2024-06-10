import { Util, UtilRaceError } from '../../src';

it('Core Util', async () => {
   // # clone<T>(src: T): T => (any type and ignore reference pointer)
   const foo = { bar: 123 };
   const foo2 = Util.clone(foo);
   foo2.bar = 456;
   expect(foo.bar).toEqual(123);
   expect(foo2.bar).toEqual(456);
   const fn = () => 1;
   expect(Util.clone(fn)).toEqual(fn);

   // # async callback<T>(fn: any, params: any[] = [], inst?: any): Promise<T>
   // ## @deprecated use call() instead

   // # call<T>(instanceThis: any, fn: any, ...params: any[]): T
   // ## Call a none function, just do nothing and return it
   expect(Util.call(null, 'Im not callable')).toEqual('Im not callable');

   // ## Call a function
   expect(Util.call(null, () => 'Hi!')).toEqual('Hi!');

   // ## Call a function with arguments
   expect(Util.call(null, (name: string, age: number) => `I'm ${name}, ${age} years old!`, 'Yu', 25)).toEqual(`I'm Yu, 25 years old!`);

   // ## Call a function with this instance
   // ## Note: this instance can't call with arrow function
   function whoAmI() {
      return this;
   }

   expect(Util.call('Iron man', whoAmI)).toEqual('Iron man');

   // # callAsync<T>(instanceThis: any, fn: any, ...params: any[]): Promise<T>
   expect(await Util.callAsync(null, new Promise((resolve) => resolve('Im here')))).toEqual('Im here');

   // # sort<T extends any[] | ObjectRecord>(data: T, options?: { key?: string }): T
   expect(Util.sort(['March', 'Jan', 'Feb', 'Dec'])).toEqual(['Dec', 'Feb', 'Jan', 'March']);
   expect(Util.sort([1, 30, 4, 21, 100000])).toEqual([1, 4, 21, 30, 100000]);

   // ## Sort by desc (defaults to asc)
   expect(Util.sort([1, 30, 4, 21, 100000], { desc: true })).toEqual([100000, 30, 21, 4, 1]);

   // ## Sort by key
   const sorted = Util.sort(Array({ foo: 10, bar: 20 }, { foo: 5, bar: 10 }), { key: 'foo' });
   expect(sorted).toEqual(Array({ foo: 5, bar: 10 }, { foo: 10, bar: 20 }));

   // # baseName(path: string, suffix?: string): string
   expect(Util.baseName('/www/site/home.html')).toEqual('home.html');
   expect(Util.baseName('/www/site/home.html', '.html')).toEqual('home');
   expect(Util.baseName('/some/path/')).toEqual('path');

   // # dirName(path: string)
   expect(Util.dirName('/etc/passwd')).toEqual('/etc');
   expect(Util.dirName('/some/path/to/')).toEqual('/some/path');

   // # race<T>(callback: any, maxMiliseconds: number): Promise<T> => Run a callback in the limited time (miliseconds)
   // ## Run the callback in around of maximum seconds otherwise it will be thrown an instance of UtilRaceError
   expect(await Util.race('Im not callable', 1)).toEqual('Im not callable');

   // ## Throw UtilRaceError because the callback run in 2 seconds while the maximum time is 1 seconds
   const timeout = async () => {
      try {
         await Util.race(new Promise((resolve) => setTimeout(resolve, 2000)), 1000);
      } catch (e) {
         return e;
      }
   };

   expect((await timeout()) instanceof UtilRaceError).toBeTruthy();

   // # numberFormat(number: number, options?: NumberFormatOptions): string
   expect(Util.numberFormat(1234.567)).toEqual('1,235');
   expect(Util.numberFormat(1234.567, { decimals: 2 })).toEqual('1,234.57');
   expect(Util.numberFormat(1234.567, { decimals: 2, decimalPoint: ',', separator: '' })).toEqual('1234,57');

   // ## With prefix
   expect(Util.numberFormat(1234.567, { decimals: 2, prefix: '$' })).toEqual('$1,234.57');

   // ## With suffix
   expect(Util.numberFormat(1234.567, { decimals: 2, suffix: 'USD' })).toEqual('1,234.57USD');

   // ## With pattern (the string that contains {value})
   expect(Util.numberFormat(1234.567, { decimals: 2, pattern: '$${value}' })).toEqual('$$1,234.57');

   // # Util.cloneObjectToCamelCase<TResult = ObjectRecord>(obj: ObjectRecord): TResult
   // ## Clone the object or deep array and change the snack key to camel case
   const obj = {
      foo_bar: { bar_foo: { num_type: { num_int: 123, num_float: 1.23, deep_array: [123, { child_element: { foo_bar: 123 } }] } }, str_type: 'string' },
      bool_type: true,
   };
   const res = {
      fooBar: { barFoo: { numType: { numInt: 123, numFloat: 1.23, deepArray: [123, { childElement: { fooBar: 123 } }] } }, strType: 'string' },
      boolType: true,
   };
   expect(Util.cloneObjectToCamelCase(obj)).toMatchObject(res);
});
