import { Transform } from '../../src';

it('Util Transform', () => {
   // # Transform methods
   /**
      -- toString
      -- toArrayUnique
      -- trim
      -- toDefault
      -- toStripTags
      -- toSafeHtml
      -- toNumber
      -- toUNumber
      -- toInt
      -- toUInt
      -- toBoolean
      -- toJsonObject
      -- toPath     
      -- toSafeFileName
      -- toNoneDiacritics
      -- toNonAccentVietnamese
      -- toASCIIString  
      -- toAlnum
    */

   // # toString(value: any): string
   // ## From the primitive value (by String(value))
   expect(Transform.toString(NaN)).toEqual('NaN');
   expect(Transform.toString(null)).toEqual('null');
   expect(Transform.toString(undefined)).toEqual('undefined');
   expect(Transform.toString(false)).toEqual('false');
   expect(Transform.toString(true)).toEqual('true');

   // ## From an object
   expect(Transform.toString({ foo: 'bar' })).toEqual(JSON.stringify({ foo: 'bar' }));

   // # toArrayUnique(value: any): any[]
   const unique = Transform.toArrayUnique([{ foo: 123 }, { foo: 123 }, { foo: 456 }]);
   expect(unique.length).toEqual(2);
   expect(unique).toMatchObject([{ foo: 123 }, { foo: 456 }]);

   // # trim(value: any, options?: { specialChars?: string; pos?: 'left' | 'right' | 'both' }) : string
   // ## Trim any space|tab|new line and option to specific some special characters
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

   // # toDefault<T extends any[]>(value: any, ...defValues: T): LastElement<T>
   // ## Returns the last value if the previous sibling is nothing (undefined | null | NaN)
   expect(Transform.toDefault(undefined, null, NaN, 0)).toEqual(0);
   expect(Transform.toDefault(null, 1)).toEqual(1);
   expect(Transform.toDefault(NaN, 2)).toEqual(2);
   expect(Transform.toDefault(undefined, false)).toEqual(false);
   expect(Transform.toDefault(null)).toEqual(undefined);

   // # toStripTags(value: any, allowedTags?: string) : string
   expect(Transform.toStripTags('1 <br/> 1', '<br><br/>')).toEqual('1 <br/> 1');
   expect(Transform.toStripTags('<i>hello</i> <<foo>script>world<</foo>/script>')).toEqual('hello world');
   expect(Transform.toStripTags(4)).toEqual('4');

   // # toSafeHtml(value: any, options?: { allowedTags?: string[]; allowedAttributes?: string[] }) : string
   expect(Transform.toSafeHtml('<a href="/path/to/url" >Click me</a>')).toEqual('<a href="/path/to/url">Click me</a>');

   const xssHtml = '<div><p>Hello, <b>World</b>!</p><script>alert("XSS");</script></div>';
   expect(Transform.toSafeHtml(xssHtml)).toEqual('<div><p>Hello, <b>World</b>!</p>alert("XSS");</div>');
   expect(Transform.toSafeHtml(' <iframe> ')).toEqual('');
   expect(Transform.toSafeHtml('<h1>Heading</h1>')).toEqual('<h1>Heading</h1>');

   // ## Only allow some tags
   expect(Transform.toSafeHtml('<h1>Heading 1</h1><h2>Heading 2</h2>', { allowedTags: ['h2'] })).toEqual('Heading 1<h2>Heading 2</h2>');

   // ## Only allow some attributes
   const link = '<a href="/path/to/url" data-src="#">Click me</a>';
   expect(Transform.toSafeHtml(link, { allowedAttributes: ['href'] })).toEqual('<a href="/path/to/url">Click me</a>');

   // # toNumber(value: any) : number
   expect(Transform.toNumber('')).toEqual(0);
   expect(Transform.toNumber('1')).toEqual(1);
   expect(Transform.toNumber('-1')).toEqual(-1);
   expect(Transform.toNumber(false)).toEqual(0);
   expect(Transform.toNumber(true)).toEqual(1);
   expect(Transform.toNumber({})).toEqual(0);
   expect(Transform.toNumber([])).toEqual(0);

   // # toUNumber(value: any) : number => unsigned number
   expect(Transform.toUNumber(-1.25)).toEqual(1.25);
   expect(Transform.toUNumber('-1.25')).toEqual(1.25);

   // # toInt(value: any) : number => integer
   expect(Transform.toInt(Number.MAX_SAFE_INTEGER + 100)).toEqual(Number.MAX_SAFE_INTEGER);
   expect(Transform.toInt(-Number.MAX_SAFE_INTEGER - 100)).toEqual(-Number.MAX_SAFE_INTEGER);
   expect(Transform.toInt(1.25)).toEqual(1);
   expect(Transform.toInt('1.25')).toEqual(1);

   // # toUInt(value: any) : number => unsigned integer
   expect(Transform.toUInt(-1)).toEqual(1);
   expect(Transform.toUInt('-1')).toEqual(1);

   // # toBoolean(value: any) : boolean
   expect(Transform.toBoolean(true)).toEqual(true);
   expect(Transform.toBoolean('true')).toEqual(true);
   expect(Transform.toBoolean('1')).toEqual(true);
   expect(Transform.toBoolean(false)).toEqual(false);
   expect(Transform.toBoolean('false')).toEqual(false);
   expect(Transform.toBoolean('0')).toEqual(false);

   // ## True if the value !== 0
   expect(Transform.toBoolean(1)).toEqual(true);
   expect(Transform.toBoolean(-1)).toEqual(true);

   // ## False if the value === 0
   expect(Transform.toBoolean(0)).toEqual(false);
   expect(Transform.toBoolean(0.0)).toEqual(false);

   // ## Other value
   expect(Transform.toBoolean([])).toEqual(true);
   expect(Transform.toBoolean({})).toEqual(true);
   expect(Transform.toBoolean('')).toEqual(false);

   // # toJsonObject<T extends any[] | ObjectRecord>(value: any, defaultJson?: T): DefaultObject<T>
   // ## From the JSON string
   expect(Transform.toJsonObject(JSON.stringify({ foo: 'bar' }))).toMatchObject({ foo: 'bar' });
   expect(Transform.toJsonObject(JSON.stringify([{ foo: 'bar' }]))).toMatchObject([{ foo: 'bar' }]);

   // ## From the object
   expect(Transform.toJsonObject({ foo: 'bar' })).toMatchObject({ foo: 'bar' });

   // ## If can't convert to object then returns an array wrapper of the value [value]
   expect(Transform.toJsonObject(123)).toEqual([123]);

   // ## If the value is nothing (null | undefined | NaN), it returns the empty object {}
   expect(Transform.toJsonObject(null)).toMatchObject({});

   // ## Or set a default object (defaults must be an object)
   expect(Transform.toJsonObject(123, { defaults: { foo: 'bar' } })).toMatchObject({ defaults: { foo: 'bar' } });
   expect(Transform.toJsonObject(null, { defaults: { foo: 'bar' } })).toMatchObject({ defaults: { foo: 'bar' } });

   // # toPath(value: any): string => valid path (URL)
   expect(Transform.toPath('/from_path/to_path///to/file .txt')).toEqual('from-path/to-path/to/file-txt');

   // # toSafeFileName(value: any): string => cleaned file name
   expect(Transform.toSafeFileName('/from_path/to_path///to/file .txt')).toEqual('frompathtopathtofile.txt');

   // # toNoneDiacritics(value: any): string => striped diacritics string
   expect(Transform.toNoneDiacritics("J'aime boire du café")).toEqual("J'aime boire du cafe");

   // ## toNonAccentVietnamese(value: any): string => none diacritics vietnamese string
   expect(Transform.toNonAccentVietnamese('Chào thế giới')).toEqual('Chao the gioi');

   // # toASCIIString(value: string): string => ASCII string
   expect(Transform.toASCIIString('Chào thế giới')).toEqual('Chao the gioi');
   expect(Transform.toASCIIString('Đây là')).toEqual('ay la');

   // # toAlnum(value: any): string => Alpha number string
   // ## Only character and number are accepted
   expect(Transform.toAlnum('^Hello @World! 2024')).toEqual('HelloWorld2024');

   // # clean(value: any, typeTransform: string | string[], ...params: any[]): any => convert to multiple types
   // ## Transform to String->Boolean
   expect(Transform.clean(1, ['toString', 'toBoolean'])).toEqual(true);

   // ## Transform to Boolean->String
   expect(Transform.clean(0, ['toBoolean', 'toString'])).toEqual('false');

   // ## The same with short way
   expect(Transform.clean(1, ['string', 'boolean'])).toEqual(true);
   expect(Transform.clean(0, ['boolean', 'string'])).toEqual('false');

   // # cleanIfType(value: any, typeTransform: string | string[], typeValue: CommonType | CommonType[]): any => clean if the value matches type
   // ## Trim if the value is string
   expect(Transform.cleanIfType(' Hi! ', 'trim', 'string')).toEqual('Hi!');

   // ## Trim and remove one alpha string
   expect(Transform.cleanIfType(' Hi! ', ['trim', 'alnum'], 'string')).toEqual('Hi');

   // ## Trim and convert to unsigned integer if the value is string or number
   expect(Transform.cleanIfType(' 1.25 ', ['trim', 'uint'], ['string', 'number'])).toEqual(1);
   expect(Transform.cleanIfType(1.25, ['trim', 'uint'], ['string', 'number'])).toEqual(1);

   // ## Do nothing if the value isn't match with they type(s), 1.25 is not the string type
   expect(Transform.cleanIfType(1.25, ['uint'], ['string'])).toEqual(1.25);
});
