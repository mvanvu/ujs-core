import { Str } from '../../src';

it('Core String', () => {
   // Common
   expect(Str.toCamelCase('Hello world!')).toEqual('helloWorld');
   expect(Str.camelToSnackCase('helloWorld')).toEqual('hello_world');
   expect(Str.snackToCamelCase('hello_world')).toEqual('helloWorld');
   expect(Str.snackToCamelCase('hello__world')).toEqual('helloWorld');
   expect(Str.toCapitalize('hello__world')).toEqual('HelloWorld');

   // Prototypes
   expect(Str.create('HelloWorld').lFirst()).toEqual('helloWorld');
   expect(Str.create('helloWorld').uFirst()).toEqual('HelloWorld');

   // Truncate
   expect(Str.truncate('hi-diddly-ho there, neighborino', 19)).toEqual('hi-diddly-ho there,...');
   expect(Str.create('hi-diddly-ho there, neighborino').truncate(19)).toEqual('hi-diddly-ho there,...');

   // Str.repeat
   expect(Str.repeat('-', 0.4)).toEqual('');
   expect(Str.repeat('-', -1)).toEqual('');
   expect(Str.repeat('-', 0)).toEqual('');
   expect(Str.repeat('-', 1)).toEqual('-');
   expect(Str.repeat('-', 2)).toEqual('--');
   expect(Str.create('==').repeat(2)).toEqual('====');
});
