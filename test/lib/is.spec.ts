import { Is, DateTime } from '../../src';

it('Core Is', () => {
   // # func<O extends IsBaseOptions>(value: any, options?: O): value is ReturnsIsFunc<O>
   expect(Is.func(() => {})).toBeTruthy();
   expect(Is.func(async () => {})).toBeTruthy();

   // ## Check the value is an async function
   expect(Is.asyncFunc(async () => {})).toBeTruthy();
   expect(Is.asyncFunc(null)).toBeFalsy();
   expect(Is.asyncFunc(() => {})).toBeFalsy();

   // # Is.number<O extends IsNumberOptions>(value: any, options?: O): value is ReturnsIsNumber<O>
   // ## Check the value is a number
   expect(Is.number(-123)).toBeTruthy();
   expect(Is.number(-123, { min: 0 })).toBeFalsy();
   expect(Is.number(-123, { max: -124 })).toBeFalsy();
   expect(Is.number(123, { integer: true })).toBeTruthy();
   expect(Is.number(123.0, { integer: true })).toBeTruthy();
   expect(Is.number(123.01, { integer: true })).toBeFalsy();

   // # Is.object<O extends IsBaseOptions>(value: any, options?: O): value is ReturnsIsObject<O>
   expect(Is.object(null)).toBeFalsy();
   expect(Is.object({})).toBeTruthy();
   expect(Is.object([])).toBeFalsy();

   // # array<O extends IsBaseOptions>(value: any, options?: O): value is ReturnsIsArray<O>
   // ## Check the value is a valid array
   expect(Is.array({})).toBeFalsy();
   expect(Is.array([1, 2, 3])).toBeTruthy();

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

   // # Is.primitive<O extends IsPrimitiveOptions>(value: any, options?: O): value is ReturnsIsPrimitive<O>
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

   // # Special primitive type: 'null' | 'undefined' | 'string' | 'number' | 'boolean' | 'symbol' | 'bigint'
   expect(Is.primitive(123, { type: 'number' })).toBeTruthy();
   expect(Is.primitive(123, { type: 'bigint' })).toBeFalsy();
   expect(Is.primitive(null, { type: 'undefined' })).toBeFalsy();

   // # Is.empty(value: any, options?: IsBaseOptions): boolean
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

   // # Is.strongPassword<O extends IsStrongPasswordOptions>(value: any, options?: O): value is ReturnsIsString<O>
   // ## Check the value is a strong password, returns false if the value is not a string
   const pwd = 'MyStrongPwd@123';
   expect(Is.strongPassword(pwd)).toBeTruthy();
   expect(Is.strongPassword(pwd, { minLength: pwd.length + 1 })).toBeFalsy();
   expect(Is.strongPassword('MyWeakPwd@')).toBeFalsy();

   // # Is.json<O extends IsBaseOptions>(value: any, options?: O): value is ReturnsIsObject<O>
   // ## Object or array that parsed from a valid JSON string
   expect(Is.json({ foo: new Map(), bar: new Set() })).toBeFalsy();
   expect(Is.json({ foo: 1, bar: [{ bar: Symbol('2') }] })).toBeFalsy();
   expect(Is.json({ foo: 1, bar: [{ bar: BigInt(1) }] })).toBeFalsy();
   expect(Is.json({ foo: 1, bar: [{ bar: 2 }] })).toBeTruthy();

   // # Is.includes(value: any, options: IsIncludesOptions): boolean
   // ## When the value is string or array
   expect(Is.includes('Hello World', { target: 'ello Wor' })).toBeTruthy();
   expect(Is.includes(['Hello World'], { target: 'ello Wor' })).toBeFalsy();
   expect(Is.includes(['Hello', 'World'], { target: 'World' })).toBeTruthy();

   // ## When the value is object and the target is object or string
   expect(Is.includes({ foo: 1, bar: 2 }, { target: { foo: 1, bar: 2 } })).toBeTruthy();
   expect(Is.includes({ foo: 1, bar: 2 }, { target: { foo: 1 } })).toBeTruthy();
   expect(Is.includes({ foo: 1, bar: 2 }, { target: { bar: 2 } })).toBeTruthy();
   expect(Is.includes({ foo: 1, bar: 2 }, { target: { bar: '2' } })).toBeFalsy();
   expect(Is.includes({ foo: 1, bar: 2 }, { target: { deep: { foo: 123, bar: 456 } } })).toBeFalsy();
   expect(Is.includes({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, { target: { deep: { foo: 123, bar: 456 } } })).toBeTruthy();

   // ## Otherwise will returns false
   expect(Is.includes(123, { target: 'string' })).toBeFalsy();
   expect(Is.includes('string', { target: false })).toBeFalsy();
   expect(Is.includes(null, { target: 'string' })).toBeFalsy();
   expect(Is.includes({}, { target: false })).toBeFalsy();

   // ## true if equals
   expect(Is.includes(false, { target: false })).toBeTruthy();
   expect(Is.includes({ foo: 1, bar: 2 }, { target: { foo: 1, bar: 2 } })).toBeTruthy();

   // # Is.class<O extends IsBaseOptions>(value: any, options?: O): value is ReturnsIsClass<O>
   expect(Is.class(class Foo {})).toBeTruthy();
   expect(Is.class([class Foo {}, class Bar {}], { isArray: true })).toBeTruthy();
   expect(Is.class(function () {})).toBeFalsy();

   // # Is.string<O extends IsStringOptions>(value: any, options?: O): value is ReturnsIsString<O>
   expect(Is.string(123)).toBeFalsy();
   expect(Is.string('123')).toBeTruthy();

   // ## Format validator: 'email' | 'mongoId' | 'date-time' | 'ipV4' | 'creditCard' | 'url' | 'number' | 'integer' | 'unsignedNumber' | 'unsignedInteger' | 'boolean' | RegExp;
   // ## Email
   expect(Is.string('user@example.com', { format: 'email' })).toBeTruthy();
   expect(Is.string('user.example.com', { format: 'email' })).toBeFalsy();

   // ## Date-Time
   expect(Is.string('2024-07-03T00:00:00.00', { format: 'date-time' })).toBeTruthy();
   expect(Is.string('2024-07-03_00:00:00.00', { format: 'date-time' })).toBeFalsy();

   // ## Mongo ID
   expect(Is.string('507f1f77bcf86cd799439011', { format: 'mongoId' })).toBeTruthy();
   expect(Is.string('507f1f77bcf86cd799439011_123', { format: 'mongoId' })).toBeFalsy();

   // ## IPv4
   expect(Is.string('192.168.1.1', { format: 'ipV4' })).toBeTruthy();
   expect(Is.string('256.256.256.256', { format: 'ipV4' })).toBeFalsy();

   // ## Credit card
   expect(Is.string('4000056655665556', { format: 'creditCard' })).toBeTruthy(); // VISA
   expect(Is.string('2223003122003222', { format: 'creditCard' })).toBeTruthy(); // MASTERCARD
   expect(Is.string('6011111111111117', { format: 'creditCard' })).toBeTruthy(); // DISCOVER
   expect(Is.string('36227206271667', { format: 'creditCard' })).toBeTruthy(); // DINERS
   expect(Is.string('3566002020360505', { format: 'creditCard' })).toBeTruthy(); // JCB

   // ## URL
   expect(Is.string('https://www.jsowl.com/remove-an-item-from-an-array-in-javascript/', { format: 'url' })).toBeTruthy();
   expect(Is.string('htt//jsowl', { format: 'url' })).toBeFalsy();
   expect(Is.string('www.jsowl.com', { format: 'url' })).toBeFalsy();

   // ## Number
   expect(Is.string('123', { format: 'number' })).toBeTruthy();
   expect(Is.string('123.01', { format: 'number' })).toBeTruthy();
   expect(Is.string('+123', { format: 'number' })).toBeFalsy();
   expect(Is.string('123.01,2', { format: 'number' })).toBeFalsy();

   // ## Unsigned number
   expect(Is.string('123', { format: 'unsignedNumber' })).toBeTruthy();
   expect(Is.string('-123.01', { format: 'unsignedNumber' })).toBeFalsy();

   // ## Integer
   expect(Is.string('123', { format: 'integer' })).toBeTruthy();
   expect(Is.string('123.00', { format: 'integer' })).toBeTruthy();
   expect(Is.string('123.01', { format: 'integer' })).toBeFalsy();
   expect(Is.string('+123.01', { format: 'integer' })).toBeFalsy();

   // ## Unsigned integer
   expect(Is.string('123', { format: 'unsignedInteger' })).toBeTruthy();
   expect(Is.string('-123.00', { format: 'unsignedInteger' })).toBeFalsy();

   // ## Boolean
   expect(Is.string('true', { format: 'boolean' })).toBeTruthy();
   expect(Is.string('false', { format: 'boolean' })).toBeTruthy();
   expect(Is.string('True', { format: 'boolean' })).toBeFalsy(); // Case sensitive
   expect(Is.string('1', { format: 'boolean' })).toBeFalsy();
   expect(Is.string('0', { format: 'boolean' })).toBeFalsy();

   // ## RegExp
   expect(Is.string('507f1f77bcf86cd799439011', { format: /^[0-9a-fA-F]{24}$/ })).toBeTruthy();

   // # Is.boolean<O extends IsBaseOptions>(value: any, options?: IsBaseOptions): value is ReturnsIsBoolean<O>
   expect(Is.boolean(true)).toBeTruthy();
   expect(Is.boolean(false)).toBeTruthy();
   expect(Is.boolean('false')).toBeFalsy();
   expect(Is.boolean(1)).toBeFalsy();
   expect(Is.boolean(0)).toBeFalsy();

   // # Is.enum(value: any, options: IsEnumOptions): boolean
   // ## Check the value is a enum from an array
   expect(Is.enum(true, { enumArray: [true, false] })).toBeTruthy();
   expect(Is.enum('Active', { enumArray: ['Active', 'Pending'] })).toBeTruthy();
   expect(Is.enum('Pending', { enumArray: ['Active', 'Pending'] })).toBeTruthy();
   expect(Is.enum('active', { enumArray: ['Active', 'Pending'] })).toBeFalsy(); // Case sensitive

   // # Validate as array
   expect(Is.string('str1', { isArray: true })).toBeFalsy();
   expect(Is.string(['str1'], { isArray: true })).toBeTruthy();
   expect(Is.string(['str1', 1, true, null], { isArray: true })).toBeFalsy();
   expect(Is.string(['str1', 'str2', 'str1'], { isArray: 'unique' })).toBeFalsy(); // Unique array
});
