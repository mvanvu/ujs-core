import { Is, DateTime } from '../../src';

it('Core Is', () => {
   // # Is.func(value: any): value is IsFunc
   expect(Is.func(() => {})).toBeTruthy();
   expect(Is.func(async () => {})).toBeTruthy();

   // ## Check the value is an async function
   expect(Is.asyncFunc(async () => {})).toBeTruthy();
   expect(Is.asyncFunc(null)).toBeFalsy();
   expect(Is.asyncFunc(() => {})).toBeFalsy();

   // # Is.number(value: any): value is number
   expect(Is.number(123)).toBeTruthy();
   expect(Is.number('123')).toBeFalsy();

   // # Is.unsignedNumber(value: any): value is number
   expect(Is.unsignedNumber(123)).toBeTruthy();
   expect(Is.unsignedNumber(-123)).toBeFalsy();

   // # Is.integer(value: any): value is number
   expect(Is.integer(123)).toBeTruthy();
   expect(Is.integer(123.0)).toBeTruthy();
   expect(Is.integer(123.01)).toBeFalsy();

   // # Is.unsignedInteger(value: any): value is number
   expect(Is.unsignedInteger(123)).toBeTruthy();
   expect(Is.unsignedInteger(-1)).toBeFalsy();

   // # Is.object(value: any): value is ObjectRecord
   expect(Is.object({})).toBeTruthy();
   expect(Is.object(null)).toBeFalsy();
   expect(Is.object([])).toBeFalsy();

   // # Is.array(value: any): value is any[]
   expect(Is.array([1, true, null])).toBeTruthy();
   expect(Is.array({})).toBeFalsy();

   // # Is.arrayUnique(value: any): value is any[]
   expect(Is.arrayUnique([1, true, null])).toBeTruthy();
   expect(Is.arrayUnique([1, 1, null])).toBeFalsy();
   const noUniqueArray = [
      { foo: 'bar', bar: 123 },
      { bar: 123, foo: 'bar' },
   ];

   expect(Is.arrayUnique(noUniqueArray)).toBeFalsy();

   // # Is.equals(a: any, b: any): boolean
   // ## Compare two values are equals or not
   expect(Is.equals(123, '123')).toBeFalsy();
   expect(Is.equals(undefined, null)).toBeFalsy();
   expect(Is.equals(123, 123)).toBeTruthy();

   const date = new Date();
   const date2 = DateTime.from(date).native;
   expect(Is.equals(date, date2)).toBeTruthy();
   expect(Is.equals(date2, DateTime.from(date))).toBeTruthy();

   // ## Deep
   expect(Is.equals({}, {})).toBeTruthy();
   expect(Is.equals({ foo: 'bar', bar: 123 }, { bar: 123, foo: 'bar' })).toBeTruthy();
   expect(Is.equals({ foo: 'bar', bar: 123 }, { bar: 123, foo: 'bar2' })).toBeFalsy();
   expect(Is.equals({ foo: 'bar', bar: 123 }, { bar: 123 })).toBeFalsy();

   // # Is.primitive(value: any): value is IsPrimitive
   // ## Primitive value is: 'null' | 'undefined' | 'string' | 'number' | 'boolean' | 'symbol' | 'bigint'
   expect(Is.primitive(123)).toBeTruthy();
   expect(Is.primitive(-123)).toBeTruthy();
   expect(Is.primitive(null)).toBeTruthy();
   expect(Is.primitive(void 0)).toBeTruthy();
   expect(Is.primitive('')).toBeTruthy();
   expect(Is.primitive(true)).toBeTruthy();
   expect(Is.primitive(false)).toBeTruthy();
   expect(Is.primitive(NaN)).toBeTruthy(); // NaN is a number type
   expect(Is.primitive([])).toBeFalsy();
   expect(Is.primitive({})).toBeFalsy();
   expect(Is.primitive(() => {})).toBeFalsy();
   expect(Is.primitive(new Set())).toBeFalsy();
   expect(Is.primitive(new Map())).toBeFalsy();

   // # Is.empty(value: any): boolean
   expect(Is.empty(0)).toBeTruthy();
   expect(Is.empty(0.0)).toBeTruthy();
   expect(Is.empty(false)).toBeTruthy();
   expect(Is.empty(null)).toBeTruthy();
   expect(Is.empty('  ')).toBeTruthy();
   expect(Is.empty([])).toBeTruthy();
   expect(Is.empty({})).toBeTruthy();
   expect(Is.empty(new Date(''))).toBeTruthy();
   expect(Is.empty(new Date())).toBeFalsy();
   expect(Is.empty(true)).toBeFalsy();
   expect(Is.empty(-1)).toBeFalsy();
   expect(Is.empty('foo')).toBeFalsy();
   expect(Is.empty([1])).toBeFalsy();
   expect(Is.empty({ foo: 'bar' })).toBeFalsy();

   // # Is.strongPassword(value: any, options?: IsStrongPasswordOptions): value is string
   // ## Check the value is a strong password, returns false if the value is not a string
   const pwd = 'MyStrongPwd@123';
   expect(Is.strongPassword(pwd)).toBeTruthy();
   expect(Is.strongPassword(pwd, { minLength: pwd.length + 1 })).toBeFalsy();
   expect(Is.strongPassword('MyWeakPwd@')).toBeFalsy();

   // # Is.json(value: any): value is ObjectRecord | any[]
   // ## Object or array that parsed from a valid JSON string
   expect(Is.json({ foo: new Map(), bar: new Set() })).toBeFalsy();
   expect(Is.json({ foo: 1, bar: [{ bar: Symbol('2') }] })).toBeFalsy();
   expect(Is.json({ foo: 1, bar: [{ bar: BigInt(1) }] })).toBeFalsy();
   expect(Is.json({ foo: 1, bar: [{ bar: 2, null: null }] })).toBeTruthy();

   // # Is.includes(value: any, target: any): boolean
   // ## When the value is string or array
   expect(Is.includes('Hello World', 'ello Wor')).toBeTruthy();
   expect(Is.includes(['Hello World'], 'ello Wor')).toBeFalsy();
   expect(Is.includes(['Hello', 'World'], 'World')).toBeTruthy();

   // ## When the value is object and the target is object or string
   expect(Is.includes({ foo: 1, bar: 2 }, { foo: 1, bar: 2 })).toBeTruthy();
   expect(Is.includes({ foo: 1, bar: 2 }, { foo: 1 })).toBeTruthy();
   expect(Is.includes({ foo: 1, bar: 2 }, { bar: 2 })).toBeTruthy();
   expect(Is.includes({ foo: 1, bar: 2 }, { deep: { foo: 123, bar: 456 } })).toBeFalsy();
   expect(Is.includes({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, { deep: { foo: 123, bar: 456 } })).toBeTruthy();

   // ## Otherwise will returns false
   expect(Is.includes(123, 'string')).toBeFalsy();
   expect(Is.includes('string', false)).toBeFalsy();
   expect(Is.includes(null, 'string')).toBeFalsy();
   expect(Is.includes({}, false)).toBeFalsy();

   // ## true if equals
   expect(Is.includes(false, false)).toBeTruthy();
   expect(Is.includes({ foo: 1, bar: 2 }, { foo: 1, bar: 2 })).toBeTruthy();

   // # Is.class(value: any): value is ClassConstructor<any>
   expect(Is.class(class Foo {})).toBeTruthy();
   expect(Is.class(function () {})).toBeFalsy();

   // # Is.string(value: any): value is string
   expect(Is.string('123')).toBeTruthy();
   expect(Is.string(123)).toBeFalsy();

   // # Is.stringFormat(value: any, format: IsStringOptions['format']): value is string
   // ## Format validator: 'email' | 'mongoId' | 'dateTime' | 'date' | 'time' | 'ipV4' | ipV6 | 'creditCard' | 'url' | 'image' | base64 | 'md5' | 'sha1' | 'sha256' | uuid | 'jwt' | 'number' | 'integer' | 'unsignedNumber' | 'unsignedInteger' | 'boolean' | trim | json | RegExp;
   // ## Email
   expect(Is.stringFormat('user@example.com', 'email')).toBeTruthy();
   expect(Is.stringFormat('user.example.com', 'email')).toBeFalsy();

   // ## Date-Time
   expect(Is.stringFormat('2024-07-03T00:00:00.00', 'dateTime')).toBeTruthy();
   expect(Is.stringFormat('2024-07-03_00:00:00.00', 'dateTime')).toBeFalsy();

   // ## Date
   expect(Is.stringFormat('2024-08-05', 'date')).toBeTruthy();
   expect(Is.stringFormat('2024-13-05', 'date')).toBeFalsy();
   expect(Is.stringFormat('2024-08-32', 'date')).toBeFalsy();
   expect(Is.stringFormat('2024-08-05T00:00:00.00', 'date')).toBeFalsy();

   // ## Time
   expect(Is.stringFormat('10:29:59', 'time')).toBeTruthy();
   expect(Is.stringFormat('10:29:59.999', 'time')).toBeTruthy();
   expect(Is.stringFormat('24:29:59.999', 'time')).toBeFalsy();
   expect(Is.stringFormat('00:60:59.999', 'time')).toBeFalsy();

   // ## Mongo ID
   expect(Is.stringFormat('507f1f77bcf86cd799439011', 'mongoId')).toBeTruthy();
   expect(Is.stringFormat('507f1f77bcf86cd799439011_123', 'mongoId')).toBeFalsy();

   // ## IPv4
   expect(Is.stringFormat('192.168.1.1', 'ipv4')).toBeTruthy();
   expect(Is.stringFormat('1.1.1.1', 'ipv4')).toBeTruthy();
   expect(Is.stringFormat('256.256.256.256', 'ipv4')).toBeFalsy();

   // ## IPv6
   expect(Is.stringFormat('2001:0db8:85a3:0000:0000:8a2e:0370:7334', 'ipv6')).toBeTruthy();
   expect(Is.stringFormat('192.168.1.1', 'ipv6')).toBeFalsy();
   expect(Is.stringFormat('1234:5678', 'ipv6')).toBeFalsy();

   // ## Credit card
   expect(Is.stringFormat('4000056655665556', 'creditCard')).toBeTruthy(); // VISA
   expect(Is.stringFormat('2223003122003222', 'creditCard')).toBeTruthy(); // MASTERCARD
   expect(Is.stringFormat('6011111111111117', 'creditCard')).toBeTruthy(); // DISCOVER
   expect(Is.stringFormat('36227206271667', 'creditCard')).toBeTruthy(); // DINERS
   expect(Is.stringFormat('3566002020360505', 'creditCard')).toBeTruthy(); // JCB

   // ## URI
   expect(Is.stringFormat('https://www.domain.com/remove-an-item-from-an-array-in-javascript/', 'uri')).toBeTruthy();
   expect(Is.stringFormat('htt//domain', 'uri')).toBeFalsy();
   expect(Is.stringFormat('www.domain.com', 'uri')).toBeFalsy();

   // ## Image
   expect(Is.stringFormat('https://2.img-dpreview.com/files/p/E~C1000x0S4000x4000T1200x1200~articles/3925134721/0266554465.jpeg', 'image')).toBeTruthy();
   expect(Is.stringFormat('https://2.img-dpreview.com/files/p/E~C1000x0S4000x4000T1200x1200~articles/3925134721/0266554465', 'image')).toBeFalsy();

   // ## Base64
   expect(Is.stringFormat('SGVsbG8gV29ybGQ=', 'base64')).toBeTruthy();
   expect(Is.stringFormat('SGVsbG8gV29ybGQ==somewhat_valid', 'base64')).toBeFalsy();

   // ## Md5
   expect(Is.stringFormat('3e25960a79dbc69b674cd4ec67a72c62', 'md5')).toBeTruthy();
   expect(Is.stringFormat('3e25960a79dbc69b674cd4ec67a72C62', 'md5')).toBeFalsy(); // C is upper case

   // ## Sha1
   expect(Is.stringFormat('7b502c3a1f48c8609ae212cdfb639dee39673f5e', 'sha1')).toBeTruthy();
   expect(Is.stringFormat('7b502c3a1f48c8609ae212cdfb639dee39673f5E', 'sha1')).toBeFalsy(); // E is upper case

   // ## Sha256
   expect(Is.stringFormat('64ec88ca00b268e5ba1a35678a1b5316d212f4f366b2477232534a8aeca37f3c', 'sha256')).toBeTruthy();
   expect(Is.stringFormat('64ec88ca00b268e5ba1a35678a1b5316d212f4f366b2477232534a8aeca37f3c_', 'sha256')).toBeFalsy();

   // ## UUID
   expect(Is.stringFormat('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'uuid')).toBeTruthy();
   expect(Is.stringFormat('12345678-1234-1234-1234-123456789012', 'uuid')).toBeFalsy(); // Invalid number of characters

   // ## JWT
   const jwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
   expect(Is.stringFormat(jwt, 'jwt')).toBeTruthy();
   expect(Is.stringFormat('Hello World', 'jwt')).toBeFalsy();

   // ## Number
   expect(Is.stringFormat('123', 'number')).toBeTruthy();
   expect(Is.stringFormat('123.01', 'number')).toBeTruthy();
   expect(Is.stringFormat('+123', 'number')).toBeFalsy();
   expect(Is.stringFormat('123.01,2', 'number')).toBeFalsy();

   // ## Unsigned number
   expect(Is.stringFormat('123', 'unsignedNumber')).toBeTruthy();
   expect(Is.stringFormat('-123.01', 'unsignedNumber')).toBeFalsy();

   // ## Integer
   expect(Is.stringFormat('123', 'integer')).toBeTruthy();
   expect(Is.stringFormat('123.00', 'integer')).toBeTruthy();
   expect(Is.stringFormat('123.01', 'integer')).toBeFalsy();
   expect(Is.stringFormat('+123.01', 'integer')).toBeFalsy();

   // ## Unsigned integer
   expect(Is.stringFormat('123', 'unsignedInteger')).toBeTruthy();
   expect(Is.stringFormat('-123.00', 'unsignedInteger')).toBeFalsy();

   // ## Boolean
   expect(Is.stringFormat('true', 'boolean')).toBeTruthy();
   expect(Is.stringFormat('false', 'boolean')).toBeTruthy();
   expect(Is.stringFormat('True', 'boolean')).toBeTruthy(); // Case insensitive
   expect(Is.stringFormat('1', 'boolean')).toBeFalsy();
   expect(Is.stringFormat('0', 'boolean')).toBeFalsy();

   // ## Trim
   expect(Is.stringFormat('Hello World', 'trim')).toBeTruthy();
   expect(Is.stringFormat(' Hello World ', 'trim')).toBeFalsy();
   expect(Is.stringFormat(' Hello World', 'trim')).toBeFalsy();
   expect(Is.stringFormat('Hello World ', 'trim')).toBeFalsy();

   // ## Json
   expect(Is.stringFormat('["Hello World"]', 'json')).toBeTruthy();
   expect(Is.stringFormat('{"foo": "bar"}', 'json')).toBeTruthy();
   expect(Is.stringFormat('Hello World', 'json')).toBeFalsy();
   expect(Is.stringFormat(['Hello World'], 'json')).toBeFalsy();
   expect(Is.stringFormat({ foo: 'bar' }, 'json')).toBeFalsy();

   // ## Alphanum
   expect(Is.stringFormat('AbcXyZ0123', 'alphanum')).toBeTruthy();
   expect(Is.stringFormat('Hello World', 'alphanum')).toBeFalsy();

   // ## Lowercase
   expect(Is.stringFormat('abc', 'lowercase')).toBeTruthy();
   expect(Is.stringFormat('Abc', 'lowercase')).toBeFalsy();

   // ## Uppercase
   expect(Is.stringFormat('ABC XYZ', 'uppercase')).toBeTruthy();
   expect(Is.stringFormat('Abc Xyz', 'uppercase')).toBeFalsy();

   // ## Slug
   expect(Is.stringFormat('this-is-an-alias-slug-url', 'slug')).toBeTruthy();
   expect(Is.stringFormat('this-is-an-alias-slug-url-123', 'slug')).toBeTruthy();
   expect(Is.stringFormat('this is not an alias slug', 'slug')).toBeFalsy();

   // ## Path
   expect(Is.stringFormat('path/to/url', 'path')).toBeTruthy();
   expect(Is.stringFormat('path/to/url/id-123', 'path')).toBeTruthy();
   expect(Is.stringFormat('/path/to/url', 'path')).toBeFalsy();
   expect(Is.stringFormat('path/to/url/', 'path')).toBeFalsy();
   expect(Is.stringFormat('/path/to/url/', 'path')).toBeFalsy();

   // ## RegExp
   expect(Is.stringFormat('507f1f77bcf86cd799439011', /^[0-9a-fA-F]{24}$/)).toBeTruthy();

   // # Is.boolean<O extends IsBaseOptions>(value: any, options?: IsBaseOptions): value is ReturnsIsBoolean<O>
   expect(Is.boolean(true)).toBeTruthy();
   expect(Is.boolean(false)).toBeTruthy();
   expect(Is.boolean('false')).toBeFalsy();
   expect(Is.boolean(1)).toBeFalsy();
   expect(Is.boolean(0)).toBeFalsy();

   // # elementOf(value: any, array: any[]): boolean
   // ## Check the value is a enum from an array
   expect(Is.elementOf(true, [true, false])).toBeTruthy();
   expect(Is.elementOf('Active', ['Active', 'Pending'])).toBeTruthy();
   expect(Is.elementOf('Pending', ['Active', 'Pending'])).toBeTruthy();
   expect(Is.elementOf('active', ['Active', 'Pending'])).toBeFalsy(); // Case sensitive
});
