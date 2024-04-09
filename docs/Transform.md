## Transform

### Usage

```javascript
import { Transform } from '@mvanvu/ujs';
```

#### Transform methods

```javascript
/**
   toString
   toArrayUnique
   trim
   toDefault
   toStripTags
   toSafeHtml
   toNumber
   toUNumber
   toInt
   toUInt
   toBoolean
   toJsonObject
   toPath
   toSafeFileName
   toNoneDiacritics
   toNonAccentVietnamese
   toASCIIString
   toAlnum
*/
```

#### toString(value: any): string

```javascript
// From the primitive value (by String(value))
Transform.toString(NaN); // It returns: 'NaN'
Transform.toString(null); // It returns: 'null'
Transform.toString(undefined); // It returns: 'undefined'
Transform.toString(false); // It returns: 'false'
Transform.toString(true); // It returns: 'true'

// From an object
Transform.toString({ foo: 'bar' }); // It returns: JSON.stringify({ foo: 'bar' })
```

#### toLowerCase(value: any): string

```javascript
Transform.toLowerCase('HELLO World'); // It returns: 'hello world'
```

#### toUpperCase(value: any): string

```javascript
Transform.toUpperCase('HELLO World'); // It returns: 'HELLO WORLD'
```

#### toArrayUnique(value: any): any[]

```javascript
const unique = Transform.toArrayUnique([{ foo: 123 }, { foo: 123 }, { foo: 456 }]);
unique.length; // It returns: 2
unique; // It returns: [{ foo: 123 }, { foo: 456 }]
```

#### trim(value: any, options?: { specialChars?: string; pos?: 'left' | 'right' | 'both' }) : string

```javascript
// Trim any space|tab|new line and option to specific some special characters
const str = `@## Hello World   ###~`;
Transform.trim(str, { specialChars: '@#~' }); // It returns: 'Hello World'

// Left trim
Transform.trim(str, { specialChars: '@#~', pos: 'left' }); // It returns: 'Hello World   ###~'

// Right trim
Transform.trim(str, { specialChars: '@#~', pos: 'right' }); // It returns: '@## Hello World'

const strWithNewLine = `
String with new line\t
`;
Transform.trim(strWithNewLine); // It returns: 'String with new line'
Transform.trim(`~!@#$%${strWithNewLine}@#`, { specialChars: '~!@#$%' }); // It returns: 'String with new line'
```

#### toDefault<T extends any[]>(value: any, ...defValues: T): LastElement<T>

```javascript
// Returns the last value if the previous sibling is nothing (undefined | null | NaN)
Transform.toDefault(undefined, null, NaN, 0); // It returns: 0
Transform.toDefault(null, 1); // It returns: 1
Transform.toDefault(NaN, 2); // It returns: 2
Transform.toDefault(undefined, false); // It returns: false
Transform.toDefault(null); // It returns: undefined
```

#### toStripTags(value: any, allowedTags?: string) : string

```javascript
Transform.toStripTags('1 <br/> 1', '<br><br/>'); // It returns: '1 <br/> 1'
Transform.toStripTags('<i>hello</i> <<foo>script>world<</foo>/script>'); // It returns: 'hello world'
Transform.toStripTags(4); // It returns: '4'
```

#### toSafeHtml(value: any, options?: { allowedTags?: string[]; allowedAttributes?: string[] }) : string

```javascript
Transform.toSafeHtml('<a href="/path/to/url" >Click me</a>'); // It returns: '<a href="/path/to/url">Click me</a>'

const xssHtml = '<div><p>Hello, <b>World</b>!</p><script>alert("XSS");</script></div>';
Transform.toSafeHtml(xssHtml); // It returns: '<div><p>Hello, <b>World</b>!</p>alert("XSS");</div>'
Transform.toSafeHtml(' <iframe> '); // It returns: ''
Transform.toSafeHtml('<h1>Heading</h1>'); // It returns: '<h1>Heading</h1>'

// Only allow some tags
Transform.toSafeHtml('<h1>Heading 1</h1><h2>Heading 2</h2>', { allowedTags: ['h2'] }); // It returns: 'Heading 1<h2>Heading 2</h2>'

// Only allow some attributes
const link = '<a href="/path/to/url" data-src="#">Click me</a>';
Transform.toSafeHtml(link, { allowedAttributes: ['href'] }); // It returns: '<a href="/path/to/url">Click me</a>'
```

#### toNumber(value: any) : number

```javascript
Transform.toNumber(''); // It returns: 0
Transform.toNumber('1'); // It returns: 1
Transform.toNumber('-1'); // It returns: -1
Transform.toNumber(false); // It returns: 0
Transform.toNumber(true); // It returns: 1
Transform.toNumber({}); // It returns: 0
Transform.toNumber([]); // It returns: 0
```

#### toUNumber(value: any) : number => unsigned number

```javascript
Transform.toUNumber(-1.25); // It returns: 1.25
Transform.toUNumber('-1.25'); // It returns: 1.25
```

#### toInt(value: any) : number => integer

```javascript
Transform.toInt(Number.MAX_SAFE_INTEGER + 100); // It returns: Number.MAX_SAFE_INTEGER
Transform.toInt(-Number.MAX_SAFE_INTEGER - 100); // It returns: -Number.MAX_SAFE_INTEGER
Transform.toInt(1.25); // It returns: 1
Transform.toInt('1.25'); // It returns: 1
```

#### toUInt(value: any) : number => unsigned integer

```javascript
Transform.toUInt(-1); // It returns: 1
Transform.toUInt('-1'); // It returns: 1
```

#### toBoolean(value: any) : boolean

```javascript
Transform.toBoolean(true); // It returns: true
Transform.toBoolean('true'); // It returns: true
Transform.toBoolean('1'); // It returns: true
Transform.toBoolean(false); // It returns: false
Transform.toBoolean('false'); // It returns: false
Transform.toBoolean('0'); // It returns: false

// True if the value !== 0
Transform.toBoolean(1); // It returns: true
Transform.toBoolean(-1); // It returns: true

// False if the value === 0
Transform.toBoolean(0); // It returns: false
Transform.toBoolean(0.0); // It returns: false

// Other value
Transform.toBoolean([]); // It returns: true
Transform.toBoolean({}); // It returns: true
Transform.toBoolean(''); // It returns: false
```

#### toJsonObject<T extends any[] | ObjectRecord>(value: any, defaultJson?: T): DefaultObject<T>

```javascript
// From the JSON string
Transform.toJsonObject(JSON.stringify({ foo: 'bar' })); // It returns: { foo: 'bar' }
Transform.toJsonObject(JSON.stringify([{ foo: 'bar' }])); // It returns: [{ foo: 'bar' }]

// From the object
Transform.toJsonObject({ foo: 'bar' }); // It returns: { foo: 'bar' }

// If can't convert to object then returns an array wrapper of the value [value]
Transform.toJsonObject(123); // It returns: [123]

// If the value is nothing (null | undefined | NaN), it returns the empty object {}
Transform.toJsonObject(null); // It returns: {}

// Or set a default object (defaults must be an object)
Transform.toJsonObject(123, { defaults: { foo: 'bar' } }); // It returns: { defaults: { foo: 'bar' } }
Transform.toJsonObject(null, { defaults: { foo: 'bar' } }); // It returns: { defaults: { foo: 'bar' } }
```

#### toPath(value: any): string => valid path (URL)

```javascript
Transform.toPath('/from_path/to_path///to/file .txt'); // It returns: 'from-path/to-path/to/file-txt'
```

#### toSafeFileName(value: any): string => cleaned file name

```javascript
Transform.toSafeFileName('/from_path/to_path///to/file .txt'); // It returns: 'frompathtopathtofile.txt'
```

#### toNoneDiacritics(value: any): string => striped diacritics string

```javascript
Transform.toNoneDiacritics("J'aime boire du café"); // It returns: "J'aime boire du cafe"

// toNonAccentVietnamese(value: any): string => none diacritics vietnamese string
Transform.toNonAccentVietnamese('Chào thế giới'); // It returns: 'Chao the gioi'
```

#### toASCIIString(value: string): string => ASCII string

```javascript
Transform.toASCIIString('Chào thế giới'); // It returns: 'Chao the gioi'
Transform.toASCIIString('Đây là'); // It returns: 'ay la'
```

#### toAlnum(value: any): string => Alpha number string

```javascript
// Only character and number are accepted
Transform.toAlnum('^Hello @World! 2024'); // It returns: 'HelloWorld2024'
```

#### clean(value: any, typeTransform: string | string[], ...params: any[]): any => convert to multiple types

```javascript
// Transform to String->Boolean
Transform.clean(1, ['toString', 'toBoolean']); // It returns: true

// Transform to Boolean->String
Transform.clean(0, ['toBoolean', 'toString']); // It returns: 'false'

// The same with short way
Transform.clean(1, ['string', 'boolean']); // It returns: true
Transform.clean(0, ['boolean', 'string']); // It returns: 'false'
```

#### cleanIfType(value: any, typeTransform: string | string[], typeValue: CommonType | CommonType[]): any => clean if the value matches type

```javascript
// Trim if the value is string
Transform.cleanIfType(' Hi! ', 'trim', 'string'); // It returns: 'Hi!'

// Trim and remove one alpha string
Transform.cleanIfType(' Hi! ', ['trim', 'alnum'], 'string'); // It returns: 'Hi'

// Trim and convert to unsigned integer if the value is string or number
Transform.cleanIfType(' 1.25 ', ['trim', 'uint'], ['string', 'number']); // It returns: 1
Transform.cleanIfType(1.25, ['trim', 'uint'], ['string', 'number']); // It returns: 1

// Do nothing if the value isn't match with they type(s), 1.25 is not the string type
Transform.cleanIfType(1.25, ['uint'], ['string']); // It returns: 1.25
```
