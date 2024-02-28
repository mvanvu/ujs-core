## TRANSFORM

### Usage

```javascript
import { Transform } from '@maivubc/ujs';
```

### Array unique

```javascript
const unique = Transform.toArrayUnique([{ foo: 123 }, { foo: 123 }, { foo: 456 }]);
unique.length; // It returns: 2
unique; // It returns: [ROOT].'[1].foo' ===  456
```

### Trim

```javascript
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
Transform.toDefault(undefined, null, NaN, 0); // It returns: 0
Transform.toDefault(null, 1); // It returns: 1
Transform.toDefault(NaN, 2); // It returns: 2
Transform.toDefault(false); // It returns: false
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
```

### Int

```javascript
Transform.toInt(Number.MAX_SAFE_INTEGER + 100); // It returns: Number.MAX_SAFE_INTEGER
Transform.toInt(-Number.MAX_SAFE_INTEGER - 100); // It returns: -Number.MAX_SAFE_INTEGER
```
