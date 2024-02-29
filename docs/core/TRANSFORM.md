## TRANSFORM

### Usage

```javascript
import { Transform } from '@maivubc/ujs';
```

### To string

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

### Array unique

```javascript
const unique = Transform.toArrayUnique([{ foo: 123 }, { foo: 123 }, { foo: 456 }]);
unique.length; // It returns: 2
unique; // It returns: [{ foo: 123 }, { foo: 456 }]
```

### Trim

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

### To default

```javascript
// Returns the last value if the previous sibling is nothing (undefined | null | NaN)
Transform.toDefault(undefined, null, NaN, 0); // It returns: 0
Transform.toDefault(null, 1); // It returns: 1
Transform.toDefault(NaN, 2); // It returns: 2
Transform.toDefault(undefined, false); // It returns: false
Transform.toDefault(null); // It returns: undefined
```

### Strip tags

```javascript
Transform.toStripTags('1 <br/> 1', '<br><br/>'); // It returns: '1 <br/> 1'
Transform.toStripTags('<i>hello</i> <<foo>script>world<</foo>/script>'); // It returns: 'hello world'
Transform.toStripTags(4); // It returns: '4'
```

### Safe HTML

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

### To number

```javascript
Transform.toNumber(''); // It returns: 0
Transform.toNumber('1'); // It returns: 1
Transform.toNumber('-1'); // It returns: -1
Transform.toNumber(false); // It returns: 0
Transform.toNumber(true); // It returns: 1
Transform.toNumber({}); // It returns: 0
Transform.toNumber([]); // It returns: 0

// To unsigned number
Transform.toUNumber(-1.25); // It returns: 1.25
Transform.toUNumber('-1.25'); // It returns: 1.25
```

### To integer

```javascript
Transform.toInt(Number.MAX_SAFE_INTEGER + 100); // It returns: Number.MAX_SAFE_INTEGER
Transform.toInt(-Number.MAX_SAFE_INTEGER - 100); // It returns: -Number.MAX_SAFE_INTEGER
Transform.toInt(1.25); // It returns: 1
Transform.toInt('1.25'); // It returns: 1

// To unsigned integer
Transform.toUInt(-1); // It returns: 1
Transform.toUInt('-1'); // It returns: 1

// To boolean
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

### To json object

```javascript
// From the JSON string
Transform.toJsonObject(JSON.stringify({ foo: 'bar' })); // It returns: { foo: 'bar' }
Transform.toJsonObject(JSON.stringify([{ foo: 'bar' }])); // It returns: [{ foo: 'bar' }]

// From the object
Transform.toJsonObject({ foo: 'bar' }); // It returns: { foo: 'bar' }

// If can't convert to object then returns an empty object {}
Transform.toJsonObject(123); // It returns: {}

// Or set a default
Transform.toJsonObject(null, { defaults: { foo: 'bar' } }); // It returns: { defaults: { foo: 'bar' } }
```

### To path

```javascript
Transform.toPath('/from_path/to_path///to/file .txt'); // It returns: 'from-path/to-path/to/file-txt'
```

### To safe file name

```javascript
Transform.toSafeFileName('/from_path/to_path///to/file .txt'); // It returns: 'frompathtopathtofile.txt'
```

### To none diacritics

```javascript
Transform.toNoneDiacritics("J'aime boire du café"); // It returns: "J'aime boire du cafe"

// To none accent Vietnamese
Transform.toNonAccentVietnamese('Chào thế giới'); // It returns: 'Chao the gioi'
```

### To ASCII string

```javascript
Transform.toASCIIString('Chào thế giới'); // It returns: 'Chao the gioi'
Transform.toASCIIString('Đây là'); // It returns: 'ay la'
```
