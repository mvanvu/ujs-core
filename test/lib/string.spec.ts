import { Str } from '../../src';

it('Core String', () => {
   // # Common
   expect(Str.toCamelCase('Hello world!')).toEqual('helloWorld');
   expect(Str.camelToSnackCase('helloWorld')).toEqual('hello_world');
   expect(Str.snackToCamelCase('hello_world')).toEqual('helloWorld');
   expect(Str.snackToCamelCase('hello__world')).toEqual('helloWorld');
   expect(Str.toCapitalize('hello__world')).toEqual('Hello__world');
   expect(Str.toCapitalize('hello! word#')).toEqual('Hello! Word#');

   // ## Ignore none word = true
   expect(Str.toCapitalize('hello! word#', true)).toEqual('HelloWord');
   expect(Str.toCapitalize('some123___testing string')).toEqual('Some123___testing String');

   // # Prototypes
   expect(Str.from('HelloWorld').lFirst()).toEqual('helloWorld');
   expect(Str.from('helloWorld').uFirst()).toEqual('HelloWorld');

   // # truncate(str: string, options?: { maxLength?: number; wordCount?: boolean; pad?: string }): string
   expect(Str.truncate('hi-diddly-ho there, neighborino', { maxLength: 19 })).toEqual('hi-diddly-ho there,...');
   expect(Str.from('hi-diddly-ho there, neighborino').truncate({ maxLength: 19 })).toEqual('hi-diddly-ho there,...');

   // ## Word count
   expect(Str.truncate('Hello world, Im new guy', { maxLength: 3, wordCount: true })).toEqual('Hello world, Im...');

   // ## Custom three dots
   expect(Str.from('hi-diddly-ho there, neighborino').truncate({ maxLength: 19, pad: '$$$' })).toEqual('hi-diddly-ho there,$$$');

   // # repeat(char: string, level = 0: string
   expect(Str.repeat('-', 0.4)).toEqual('');
   expect(Str.repeat('-', -1)).toEqual('');
   expect(Str.repeat('-', 0)).toEqual('');
   expect(Str.repeat('-', 1)).toEqual('-');
   expect(Str.repeat('-', 2)).toEqual('--');
   expect(Str.from('==').repeat(2)).toEqual('====');

   // # The string instance has the same the static method: toCamelCase, camelToSnackCase, snackToCamelCase, toCapitalize and truncate
   const str = Str.from('Hello world!');
   expect(str.toCamelCase()).toEqual('helloWorld');
   expect(str.truncate({ maxLength: 5, pad: '...$$' })).toEqual('Hello...$$');
});
