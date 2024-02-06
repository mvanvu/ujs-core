import { Transform } from '../../src';

it('Util Transform', () => {
   // Array unique
   const unique = Transform.toArrayUnique([{ foo: 123 }, { foo: 123 }, { foo: 456 }]);
   expect(unique.length).toEqual(2);
   expect(unique).toHaveProperty('[1].foo', 456);

   // Trim
   const str = `@## Hello World   ###~`;
   expect(Transform.trim(str, { specialChars: '@#~' })).toEqual('Hello World');
   expect(Transform.trim(str, { specialChars: '@#~', pos: 'left' })).toEqual('Hello World   ###~');
   expect(Transform.trim(str, { specialChars: '@#~', pos: 'right' })).toEqual('@## Hello World');

   const strWithNewLine = `
      String with new line\t
   `;
   expect(Transform.trim(strWithNewLine)).toEqual('String with new line');
   expect(Transform.trim(`~!@#$%${strWithNewLine}@#`, { specialChars: '~!@#$%' })).toEqual('String with new line');

   // To default
   expect(Transform.toDefault(undefined, null, NaN, 0)).toEqual(0);
   expect(Transform.toDefault(null, 1)).toEqual(1);
   expect(Transform.toDefault(NaN, 2)).toEqual(2);
   expect(Transform.toDefault(false)).toEqual(false);
});
