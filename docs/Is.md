## Is

### Usage

```javascript
import { Is, DateTime } from '@mvanvu/ujs';
```

#### func<O extends IsBaseOptions>(value: any, options?: O): value is ReturnsIsFunc<O>

```javascript
Is.func(() => {}); // It returns: true
Is.func(async () => {}); // It returns: true

// Check the value is an async function
Is.asyncFunc(async () => {}); // It returns: true
Is.asyncFunc(null); // It returns: false
Is.asyncFunc(() => {}); // It returns: false
```

#### Is.number<O extends IsNumberOptions>(value: any, options?: O): value is ReturnsIsNumber<O>

```javascript
// Check the value is a number
Is.number(-123); // It returns: true
Is.number(-123, { min: 0 }); // It returns: false
Is.number(-123, { max: -124 }); // It returns: false
Is.number(123, { integer: true }); // It returns: true
Is.number(123.0, { integer: true }); // It returns: true
Is.number(123.01, { integer: true }); // It returns: false
```

#### Is.object<O extends IsBaseOptions>(value: any, options?: O): value is ReturnsIsObject<O>

```javascript
Is.object(null); // It returns: false
Is.object({}); // It returns: true
Is.object([]); // It returns: false
```

#### array<O extends IsBaseOptions>(value: any, options?: O): value is ReturnsIsArray<O>

```javascript
// Check the value is a valid array
Is.array({}); // It returns: false
Is.array([1, 2, 3]); // It returns: true
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

#### Is.primitive<O extends IsPrimitiveOptions>(value: any, options?: O): value is ReturnsIsPrimitive<O>

```javascript
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

#### Special primitive type: 'null' | 'undefined' | 'string' | 'number' | 'boolean' | 'symbol' | 'bigint'

```javascript
Is.primitive(123, { type: 'number' }); // It returns: true
Is.primitive(123, { type: 'bigint' }); // It returns: false
Is.primitive(null, { type: 'undefined' }); // It returns: false
```

#### Is.empty(value: any, options?: IsBaseOptions): boolean

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

#### Is.strongPassword<O extends IsStrongPasswordOptions>(value: any, options?: O): value is ReturnsIsString<O>

```javascript
// Check the value is a strong password, returns false if the value is not a string
const pwd = 'MyStrongPwd@123';
Is.strongPassword(pwd); // It returns: true
Is.strongPassword(pwd, { minLength: pwd.length + 1 }); // It returns: false
Is.strongPassword('MyWeakPwd@'); // It returns: false
```

#### Is.json<O extends IsBaseOptions>(value: any, options?: O): value is ReturnsIsObject<O>

```javascript
// Object or array that parsed from a valid JSON string
Is.json({ foo: new Map(), bar: new Set() }); // It returns: false
Is.json({ foo: 1, bar: [{ bar: Symbol('2') }] }); // It returns: false
Is.json({ foo: 1, bar: [{ bar: BigInt(1) }] }); // It returns: false
Is.json({ foo: 1, bar: [{ bar: 2 }] }); // It returns: true
```

#### Is.includes(value: any, options: IsIncludesOptions): boolean

```javascript
// When the value is string or array
Is.includes('Hello World', { target: 'ello Wor' }); // It returns: true
Is.includes(['Hello World'], { target: 'ello Wor' }); // It returns: false
Is.includes(['Hello', 'World'], { target: 'World' }); // It returns: true

// When the value is object and the target is object or string
Is.includes({ foo: 1, bar: 2 }, { target: { foo: 1, bar: 2 } }); // It returns: true
Is.includes({ foo: 1, bar: 2 }, { target: { foo: 1 } }); // It returns: true
Is.includes({ foo: 1, bar: 2 }, { target: { bar: 2 } }); // It returns: true
Is.includes({ foo: 1, bar: 2 }, { target: { bar: '2' } }); // It returns: false
Is.includes({ foo: 1, bar: 2 }, { target: { deep: { foo: 123, bar: 456 } } }); // It returns: false
Is.includes({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, { target: { deep: { foo: 123, bar: 456 } } }); // It returns: true

// Otherwise will returns false
Is.includes(123, { target: 'string' }); // It returns: false
Is.includes('string', { target: false }); // It returns: false
Is.includes(null, { target: 'string' }); // It returns: false
Is.includes({}, { target: false }); // It returns: false

// true if equals
Is.includes(false, { target: false }); // It returns: true
Is.includes({ foo: 1, bar: 2 }, { target: { foo: 1, bar: 2 } }); // It returns: true
```

#### Is.class<O extends IsBaseOptions>(value: any, options?: O): value is ReturnsIsClass<O>

```javascript
Is.class(class Foo {}); // It returns: true
Is.class([class Foo {}, class Bar {}], { isArray: true }); // It returns: true
Is.class(function () {}); // It returns: false
```

#### Is.string<O extends IsStringOptions>(value: any, options?: O): value is ReturnsIsString<O>

```javascript
Is.string(123); // It returns: false
Is.string('123'); // It returns: true

// Format validator: 'email' | 'mongoId' | 'date-time' | 'ipV4' | 'creditCard' | 'url' | 'number' | 'integer' | 'unsignedNumber' | 'unsignedInteger' | 'boolean' | RegExp;

// Email
Is.string('user@example.com', { format: 'email' }); // It returns: true
Is.string('user.example.com', { format: 'email' }); // It returns: false

// Date-Time
Is.string('2024-07-03T00:00:00.00', { format: 'date-time' }); // It returns: true
Is.string('2024-07-03_00:00:00.00', { format: 'date-time' }); // It returns: false

// Mongo ID
Is.string('507f1f77bcf86cd799439011', { format: 'mongoId' }); // It returns: true
Is.string('507f1f77bcf86cd799439011_123', { format: 'mongoId' }); // It returns: false

// IPv4
Is.string('192.168.1.1', { format: 'ipV4' }); // It returns: true
Is.string('256.256.256.256', { format: 'ipV4' }); // It returns: false

// Credit card
expect(Is.string('4000056655665556', { format: 'creditCard' })).toBeTruthy(); // VISA
expect(Is.string('2223003122003222', { format: 'creditCard' })).toBeTruthy(); // MASTERCARD
expect(Is.string('6011111111111117', { format: 'creditCard' })).toBeTruthy(); // DISCOVER
expect(Is.string('36227206271667', { format: 'creditCard' })).toBeTruthy(); // DINERS
expect(Is.string('3566002020360505', { format: 'creditCard' })).toBeTruthy(); // JCB

// URL
Is.string('https://www.jsowl.com/remove-an-item-from-an-array-in-javascript/', { format: 'url' }); // It returns: true
Is.string('htt//jsowl', { format: 'url' }); // It returns: false
Is.string('www.jsowl.com', { format: 'url' }); // It returns: false

// Number
Is.string('123', { format: 'number' }); // It returns: true
Is.string('123.01', { format: 'number' }); // It returns: true
Is.string('+123', { format: 'number' }); // It returns: false
Is.string('123.01,2', { format: 'number' }); // It returns: false

// Unsigned number
Is.string('123', { format: 'unsignedNumber' }); // It returns: true
Is.string('-123.01', { format: 'unsignedNumber' }); // It returns: false

// Integer
Is.string('123', { format: 'integer' }); // It returns: true
Is.string('123.00', { format: 'integer' }); // It returns: true
Is.string('123.01', { format: 'integer' }); // It returns: false
Is.string('+123.01', { format: 'integer' }); // It returns: false

// Unsigned integer
Is.string('123', { format: 'unsignedInteger' }); // It returns: true
Is.string('-123.00', { format: 'unsignedInteger' }); // It returns: false

// Boolean
Is.string('true', { format: 'boolean' }); // It returns: true
Is.string('false', { format: 'boolean' }); // It returns: true
expect(Is.string('True', { format: 'boolean' })).toBeFalsy(); // Case sensitive
Is.string('1', { format: 'boolean' }); // It returns: false
Is.string('0', { format: 'boolean' }); // It returns: false

// RegExp
Is.string('507f1f77bcf86cd799439011', { format: /^[0-9a-fA-F]{24}$/ }); // It returns: true
```

#### Is.boolean<O extends IsBaseOptions>(value: any, options?: IsBaseOptions): value is ReturnsIsBoolean<O>

```javascript
Is.boolean(true); // It returns: true
Is.boolean(false); // It returns: true
Is.boolean('false'); // It returns: false
Is.boolean(1); // It returns: false
Is.boolean(0); // It returns: false
```

#### Is.enum(value: any, options: IsEnumOptions): boolean

```javascript
// Check the value is a enum from an array
Is.enum(true, { enumArray: [true, false] }); // It returns: true
Is.enum('Active', { enumArray: ['Active', 'Pending'] }); // It returns: true
Is.enum('Pending', { enumArray: ['Active', 'Pending'] }); // It returns: true
expect(Is.enum('active', { enumArray: ['Active', 'Pending'] })).toBeFalsy(); // Case sensitive
```

#### Validate as array

```javascript
Is.string('str1', { isArray: true }); // It returns: false
Is.string(['str1'], { isArray: true }); // It returns: true
Is.string(['str1', 1, true, null], { isArray: true }); // It returns: false
expect(Is.string(['str1', 'str2', 'str1'], { isArray: 'unique' })).toBeFalsy(); // Unique array
```
