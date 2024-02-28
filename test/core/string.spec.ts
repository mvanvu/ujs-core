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

   // # Truncate
   expect(Str.truncate('hi-diddly-ho there, neighborino', 19)).toEqual('hi-diddly-ho there,...');
   expect(Str.from('hi-diddly-ho there, neighborino').truncate(19)).toEqual('hi-diddly-ho there,...');

   // # Repeat
   expect(Str.repeat('-', 0.4)).toEqual('');
   expect(Str.repeat('-', -1)).toEqual('');
   expect(Str.repeat('-', 0)).toEqual('');
   expect(Str.repeat('-', 1)).toEqual('-');
   expect(Str.repeat('-', 2)).toEqual('--');
   expect(Str.from('==').repeat(2)).toEqual('====');
});
