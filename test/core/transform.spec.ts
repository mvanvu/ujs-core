import { Transform } from '../../src';

it('Util Transform', () => {
   // # Array unique
   const unique = Transform.toArrayUnique([{ foo: 123 }, { foo: 123 }, { foo: 456 }]);
   expect(unique.length).toEqual(2);
   expect(unique).toHaveProperty('[1].foo', 456);

   // # Trim
   const str = `@## Hello World   ###~`;
   expect(Transform.trim(str, { specialChars: '@#~' })).toEqual('Hello World');

   // ## Left trim
   expect(Transform.trim(str, { specialChars: '@#~', pos: 'left' })).toEqual('Hello World   ###~');

   // ## Right trim
   expect(Transform.trim(str, { specialChars: '@#~', pos: 'right' })).toEqual('@## Hello World');

   const strWithNewLine = `
      String with new line\t
   `;
   expect(Transform.trim(strWithNewLine)).toEqual('String with new line');
   expect(Transform.trim(`~!@#$%${strWithNewLine}@#`, { specialChars: '~!@#$%' })).toEqual('String with new line');

   // # To default
   expect(Transform.toDefault(undefined, null, NaN, 0)).toEqual(0);
   expect(Transform.toDefault(null, 1)).toEqual(1);
   expect(Transform.toDefault(NaN, 2)).toEqual(2);
   expect(Transform.toDefault(false)).toEqual(false);

   // # Strip tags
   expect(Transform.toStripTags('1 <br/> 1', '<br><br/>')).toEqual('1 <br/> 1');
   expect(Transform.toStripTags('<i>hello</i> <<foo>script>world<</foo>/script>')).toEqual('hello world');
   expect(Transform.toStripTags(4)).toEqual('4');

   // # Safe HTML
   expect(Transform.toSafeHtml('<a href="/path/to/url" >Click me</a>')).toEqual('<a href="/path/to/url">Click me</a>');

   const xssHtml = '<div><p>Hello, <b>World</b>!</p><script>alert("XSS");</script></div>';
   expect(Transform.toSafeHtml(xssHtml)).toEqual('<div><p>Hello, <b>World</b>!</p>alert("XSS");</div>');
   expect(Transform.toSafeHtml(' <iframe> ')).toEqual('');
   expect(Transform.toSafeHtml('<h1>Heading</h1>')).toEqual('<h1>Heading</h1>');

   // # Int
   expect(Transform.toInt(Number.MAX_SAFE_INTEGER + 100)).toEqual(Number.MAX_SAFE_INTEGER);
   expect(Transform.toInt(-Number.MAX_SAFE_INTEGER - 100)).toEqual(-Number.MAX_SAFE_INTEGER);
});
