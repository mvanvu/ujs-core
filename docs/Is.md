## Is

### Usage

```javascript
import { Is, DateTime } from '@mvanvu/ujs';
```

#### Is.func(value: any): value is IsFunc

```javascript
Is.func(() => {}); // It returns: true
Is.func(async () => {}); // It returns: true

// Check the value is an async function
Is.asyncFunc(async () => {}); // It returns: true
Is.asyncFunc(null); // It returns: false
Is.asyncFunc(() => {}); // It returns: false
```

#### Is.number(value: any): value is number

```javascript
Is.number(123); // It returns: true
Is.number('123'); // It returns: false
```

#### Is.unsignedNumber(value: any): value is number

```javascript
Is.unsignedNumber(123); // It returns: true
Is.unsignedNumber(-123); // It returns: false
```

#### Is.integer(value: any): value is number

```javascript
Is.integer(123); // It returns: true
Is.integer(123.0); // It returns: true
Is.integer(123.01); // It returns: false
```

#### Is.unsignedInteger(value: any): value is number

```javascript
Is.unsignedInteger(123); // It returns: true
Is.unsignedInteger(-1); // It returns: false
```

#### Is.object(value: any): value is ObjectRecord

```javascript
Is.object({}); // It returns: true
Is.object(null); // It returns: false
Is.object([]); // It returns: false
```

#### Is.array(value: any): value is any[]

```javascript
Is.array([1, true, null]); // It returns: true
Is.array({}); // It returns: false
```

#### Is.arrayUnique(value: any): value is any[]

```javascript
Is.arrayUnique([1, true, null]); // It returns: true
Is.arrayUnique([1, 1, null]); // It returns: false
const noUniqueArray = [
   { foo: 'bar', bar: 123 },
   { bar: 123, foo: 'bar' },
];

Is.arrayUnique(noUniqueArray); // It returns: false
```

#### Is.equals(a: any, b: any): boolean

```javascript
// Compare two values are equals or not
Is.equals(123, '123'); // It returns: false
Is.equals(undefined, null); // It returns: false
Is.equals(123, 123); // It returns: true

const date = new Date();
const date2 = DateTime.from(date).native;
Is.equals(date, date2); // It returns: true
Is.equals(date2, DateTime.from(date)); // It returns: true

// Deep
Is.equals({}, {}); // It returns: true
Is.equals({ foo: 'bar', bar: 123 }, { bar: 123, foo: 'bar' }); // It returns: true
Is.equals({ foo: 'bar', bar: 123 }, { bar: 123, foo: 'bar2' }); // It returns: false
Is.equals({ foo: 'bar', bar: 123 }, { bar: 123 }); // It returns: false
```

#### Is.primitive(value: any): value is IsPrimitive

```javascript
// Primitive value is: 'null' | 'undefined' | 'string' | 'number' | 'boolean' | 'symbol' | 'bigint'
Is.primitive(123); // It returns: true
Is.primitive(-123); // It returns: true
Is.primitive(null); // It returns: true
Is.primitive(void 0); // It returns: true
Is.primitive(''); // It returns: true
Is.primitive(true); // It returns: true
Is.primitive(false); // It returns: true
expect(Is.primitive(NaN)).toBeTruthy(); // NaN is a number type
Is.primitive([]); // It returns: false
Is.primitive({}); // It returns: false
Is.primitive(() => {}); // It returns: false
Is.primitive(new Set()); // It returns: false
Is.primitive(new Map()); // It returns: false
```

#### Is.empty(value: any): boolean

```javascript
Is.empty(0); // It returns: true
Is.empty(0.0); // It returns: true
Is.empty(false); // It returns: true
Is.empty(null); // It returns: true
Is.empty('  '); // It returns: true
Is.empty([]); // It returns: true
Is.empty({}); // It returns: true
Is.empty(new Date('')); // It returns: true
Is.empty(new Date()); // It returns: false
Is.empty(true); // It returns: false
Is.empty(-1); // It returns: false
Is.empty('foo'); // It returns: false
Is.empty([1]); // It returns: false
Is.empty({ foo: 'bar' }); // It returns: false
```

#### Is.strongPassword(value: any, options?: IsStrongPasswordOptions): value is string

```javascript
// Check the value is a strong password, returns false if the value is not a string
const pwd = 'MyStrongPwd@123';
Is.strongPassword(pwd); // It returns: true
Is.strongPassword(pwd, { minLength: pwd.length + 1 }); // It returns: false
Is.strongPassword('MyWeakPwd@'); // It returns: false
```

#### Is.json(value: any): value is ObjectRecord | any[]

```javascript
// Object or array that parsed from a valid JSON string
Is.json({ foo: new Map(), bar: new Set() }); // It returns: false
Is.json({ foo: 1, bar: [{ bar: Symbol('2') }] }); // It returns: false
Is.json({ foo: 1, bar: [{ bar: BigInt(1) }] }); // It returns: false
Is.json({ foo: 1, bar: [{ bar: 2, null: null }] }); // It returns: true
```

#### Is.includes(value: any, target: any): boolean

```javascript
// When the value is string or array
Is.includes('Hello World', 'ello Wor'); // It returns: true
Is.includes(['Hello World'], 'ello Wor'); // It returns: false
Is.includes(['Hello', 'World'], 'World'); // It returns: true

// When the value is object and the target is object or string
Is.includes({ foo: 1, bar: 2 }, { foo: 1, bar: 2 }); // It returns: true
Is.includes({ foo: 1, bar: 2 }, { foo: 1 }); // It returns: true
Is.includes({ foo: 1, bar: 2 }, { bar: 2 }); // It returns: true
Is.includes({ foo: 1, bar: 2 }, { deep: { foo: 123, bar: 456 } }); // It returns: false
Is.includes({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, { deep: { foo: 123, bar: 456 } }); // It returns: true

// Otherwise will returns false
Is.includes(123, 'string'); // It returns: false
Is.includes('string', false); // It returns: false
Is.includes(null, 'string'); // It returns: false
Is.includes({}, false); // It returns: false

// true if equals
Is.includes(false, false); // It returns: true
Is.includes({ foo: 1, bar: 2 }, { foo: 1, bar: 2 }); // It returns: true
```

#### Is.class(value: any): value is ClassConstructor<any>

```javascript
Is.class(class Foo {}); // It returns: true
Is.class(function () {}); // It returns: false
```

#### Is.string(value: any): value is string

```javascript
Is.string('123'); // It returns: true
Is.string(123); // It returns: false
```

#### Is.stringFormat(value: any, format: IsStringOptions['format']): value is string

```javascript
// Format validator: 'email' | 'mongoId' | 'dateTime' | 'date' | 'time' | 'ipV4' | ipV6 | 'creditCard' | 'url' | 'image' | base64 | 'md5' | 'sha1' | 'sha256' | uuid | 'jwt' | 'number' | 'integer' | 'unsignedNumber' | 'unsignedInteger' | 'boolean' | trim | json | RegExp;

// Email
Is.stringFormat('user@example.com', 'email'); // It returns: true
Is.stringFormat('user.example.com', 'email'); // It returns: false

// Date-Time
Is.stringFormat('2024-07-03T00:00:00.00', 'dateTime'); // It returns: true
Is.stringFormat('2024-07-03_00:00:00.00', 'dateTime'); // It returns: false

// Date
Is.stringFormat('2024-08-05', 'date'); // It returns: true
Is.stringFormat('2024-13-05', 'date'); // It returns: false
Is.stringFormat('2024-08-32', 'date'); // It returns: false
Is.stringFormat('2024-08-05T00:00:00.00', 'date'); // It returns: false

// Time
Is.stringFormat('10:29:59', 'time'); // It returns: true
Is.stringFormat('10:29:59.999', 'time'); // It returns: true
Is.stringFormat('24:29:59.999', 'time'); // It returns: false
Is.stringFormat('00:60:59.999', 'time'); // It returns: false

// Mongo ID
Is.stringFormat('507f1f77bcf86cd799439011', 'mongoId'); // It returns: true
Is.stringFormat('507f1f77bcf86cd799439011_123', 'mongoId'); // It returns: false

// IPv4
Is.stringFormat('192.168.1.1', 'ipv4'); // It returns: true
Is.stringFormat('1.1.1.1', 'ipv4'); // It returns: true
Is.stringFormat('256.256.256.256', 'ipv4'); // It returns: false

// IPv6
Is.stringFormat('2001:0db8:85a3:0000:0000:8a2e:0370:7334', 'ipv6'); // It returns: true
Is.stringFormat('192.168.1.1', 'ipv6'); // It returns: false
Is.stringFormat('1234:5678', 'ipv6'); // It returns: false

// Credit card
expect(Is.stringFormat('4000056655665556', 'creditCard')).toBeTruthy(); // VISA
expect(Is.stringFormat('2223003122003222', 'creditCard')).toBeTruthy(); // MASTERCARD
expect(Is.stringFormat('6011111111111117', 'creditCard')).toBeTruthy(); // DISCOVER
expect(Is.stringFormat('36227206271667', 'creditCard')).toBeTruthy(); // DINERS
expect(Is.stringFormat('3566002020360505', 'creditCard')).toBeTruthy(); // JCB

// URI
Is.stringFormat('https://www.domain.com/remove-an-item-from-an-array-in-javascript/', 'uri'); // It returns: true
Is.stringFormat('htt//domain', 'uri'); // It returns: false
Is.stringFormat('www.domain.com', 'uri'); // It returns: false

// Image
Is.stringFormat('https://2.img-dpreview.com/files/p/E~C1000x0S4000x4000T1200x1200~articles/3925134721/0266554465.jpeg', 'image'); // It returns: true
Is.stringFormat('https://2.img-dpreview.com/files/p/E~C1000x0S4000x4000T1200x1200~articles/3925134721/0266554465', 'image'); // It returns: false

// Base64
Is.stringFormat('SGVsbG8gV29ybGQ=', 'base64'); // It returns: true
Is.stringFormat('SGVsbG8gV29ybGQ==somewhat_valid', 'base64'); // It returns: false

// Md5
Is.stringFormat('3e25960a79dbc69b674cd4ec67a72c62', 'md5'); // It returns: true
expect(Is.stringFormat('3e25960a79dbc69b674cd4ec67a72C62', 'md5')).toBeFalsy(); // C is upper case

// Sha1
Is.stringFormat('7b502c3a1f48c8609ae212cdfb639dee39673f5e', 'sha1'); // It returns: true
expect(Is.stringFormat('7b502c3a1f48c8609ae212cdfb639dee39673f5E', 'sha1')).toBeFalsy(); // E is upper case

// Sha256
Is.stringFormat('64ec88ca00b268e5ba1a35678a1b5316d212f4f366b2477232534a8aeca37f3c', 'sha256'); // It returns: true
Is.stringFormat('64ec88ca00b268e5ba1a35678a1b5316d212f4f366b2477232534a8aeca37f3c_', 'sha256'); // It returns: false

// UUID
Is.stringFormat('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'uuid'); // It returns: true
expect(Is.stringFormat('12345678-1234-1234-1234-123456789012', 'uuid')).toBeFalsy(); // Invalid number of characters

// JWT
const jwt =
   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
Is.stringFormat(jwt, 'jwt'); // It returns: true
Is.stringFormat('Hello World', 'jwt'); // It returns: false

// Number
Is.stringFormat('123', 'number'); // It returns: true
Is.stringFormat('123.01', 'number'); // It returns: true
Is.stringFormat('+123', 'number'); // It returns: false
Is.stringFormat('123.01,2', 'number'); // It returns: false

// Unsigned number
Is.stringFormat('123', 'unsignedNumber'); // It returns: true
Is.stringFormat('-123.01', 'unsignedNumber'); // It returns: false

// Integer
Is.stringFormat('123', 'integer'); // It returns: true
Is.stringFormat('123.00', 'integer'); // It returns: true
Is.stringFormat('123.01', 'integer'); // It returns: false
Is.stringFormat('+123.01', 'integer'); // It returns: false

// Unsigned integer
Is.stringFormat('123', 'unsignedInteger'); // It returns: true
Is.stringFormat('-123.00', 'unsignedInteger'); // It returns: false

// Boolean
Is.stringFormat('true', 'boolean'); // It returns: true
Is.stringFormat('false', 'boolean'); // It returns: true
expect(Is.stringFormat('True', 'boolean')).toBeTruthy(); // Case insensitive
Is.stringFormat('1', 'boolean'); // It returns: false
Is.stringFormat('0', 'boolean'); // It returns: false

// Trim
Is.stringFormat('Hello World', 'trim'); // It returns: true
Is.stringFormat(' Hello World ', 'trim'); // It returns: false
Is.stringFormat(' Hello World', 'trim'); // It returns: false
Is.stringFormat('Hello World ', 'trim'); // It returns: false

// Json
Is.stringFormat('["Hello World"]', 'json'); // It returns: true
Is.stringFormat('{"foo": "bar"}', 'json'); // It returns: true
Is.stringFormat('Hello World', 'json'); // It returns: false
Is.stringFormat(['Hello World'], 'json'); // It returns: false
Is.stringFormat({ foo: 'bar' }, 'json'); // It returns: false

// Alphanum
Is.stringFormat('AbcXyZ0123', 'alphanum'); // It returns: true
Is.stringFormat('Hello World', 'alphanum'); // It returns: false

// Lowercase
Is.stringFormat('abc', 'lowercase'); // It returns: true
Is.stringFormat('Abc', 'lowercase'); // It returns: false

// Uppercase
Is.stringFormat('ABC XYZ', 'uppercase'); // It returns: true
Is.stringFormat('Abc Xyz', 'uppercase'); // It returns: false

// Slug
Is.stringFormat('this-is-an-alias-slug-url', 'slug'); // It returns: true
Is.stringFormat('this-is-an-alias-slug-url-123', 'slug'); // It returns: true
Is.stringFormat('this is not an alias slug', 'slug'); // It returns: false

// Path
Is.stringFormat('path/to/url', 'path'); // It returns: true
Is.stringFormat('path/to/url/id-123', 'path'); // It returns: true
Is.stringFormat('/path/to/url', 'path'); // It returns: false
Is.stringFormat('path/to/url/', 'path'); // It returns: false
Is.stringFormat('/path/to/url/', 'path'); // It returns: false

// RegExp
Is.stringFormat('507f1f77bcf86cd799439011', /^[0-9a-fA-F]{24}$/); // It returns: true
```

#### Is.boolean<O extends IsBaseOptions>(value: any, options?: IsBaseOptions): value is ReturnsIsBoolean<O>

```javascript
Is.boolean(true); // It returns: true
Is.boolean(false); // It returns: true
Is.boolean('false'); // It returns: false
Is.boolean(1); // It returns: false
Is.boolean(0); // It returns: false
```

#### elementOf(value: any, array: any[]): boolean

```javascript
// Check the value is a enum from an array
Is.elementOf(true, [true, false]); // It returns: true
Is.elementOf('Active', ['Active', 'Pending']); // It returns: true
Is.elementOf('Pending', ['Active', 'Pending']); // It returns: true
expect(Is.elementOf('active', ['Active', 'Pending'])).toBeFalsy(); // Case sensitive
```
