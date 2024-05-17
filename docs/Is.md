## Is

### Usage

```javascript
import { Is, DateTime } from '@mvanvu/ujs';
```

#### Common Type

```javascript
/**
   'string'       -> String (native)
   'number'       -> Number (native)
   'snumber'      -> Signed number
   'unumber'      -> Unsigned number
   'int'          -> Integer
   'sint'         -> Signed integer
   'uint'         -> Unsigned integer
   'bigint'       -> Bigint (native)
   'sbigint'      -> Signed bigint
   'ubigint'      -> Unsigned bigint
   'object'       -> Object (native)
   'array'        -> Array (native)
   'boolean'      -> Boolean (native)
   'undefined'    -> undefined (primitive)
   'symbol'       -> Symbol (native)
   'function'     -> Function (native)
   'null'         -> null (primitive)
   'regex'        -> Regex (native)
   'set'          -> Set (native)
   'map'          -> Map (native)
   'NaN'          -> NaN (native)
   'date'         -> Date (native)
   'datetime'     -> [DateTime](/Datetime.md)
   'datestring'   -> String date
*/
```

#### Is.emptyObject(obj: any): boolean

```javascript
// Check the object is empty, returns false if the value is not an object
Is.emptyObject(null); // It returns: false
Is.emptyObject([]); // It returns: false
Is.emptyObject({ foo: 'bar' }); // It returns: false
Is.emptyObject({}); // It returns: true
```

#### Is.date(d: any): boolean

```javascript
// Check the value is instance of Date
Is.date(new Date()); // It returns: true
Is.date(''); // It returns: false
```

#### Is.datetime(d: any): boolean

```javascript
// Check the value is instance of [DateTime](Datetime.md)
Is.datetime(DateTime.now()); // It returns: true
```

#### Is.dateString(d: any): boolean

```javascript
// Check the value is a valid string date, returns false if the value is not a string
Is.dateString('2024-02-28'); // It returns: true
```

#### Is.asyncFunc(value: any): boolean

```javascript
// Check the value is an async function
Is.asyncFunc(null); // It returns: false
Is.asyncFunc(() => {}); // It returns: false
Is.asyncFunc(async () => {}); // It returns: true
```

#### Is.int(value: any, each = false): boolean

```javascript
// Check the value is an integer number
Is.int(123); // It returns: true

// Check the value is a signed integer number
Is.sInt(1); // It returns: false

// Check the value is a unsigned integer number
Is.uInt(-123.4); // It returns: false

// Check for each element of the array
Is.int([123, 456, 789], true); // It returns: true
Is.int([123, '456', 789], true); // It returns: false
```

#### Is.bigInt(value: any, each = false): boolean

```javascript
// Check the value is a big integer number
Is.bigInt(1); // It returns: false
Is.bigInt(1n); // It returns: true

// Check the value is a signed integer number
Is.sBigInt(-1n); // It returns: true

// Check the value is a unsigned integer number
Is.uBigInt(1n); // It returns: true

// Check for each element of the array
Is.bigInt([1n, 2n, 3n], true); // It returns: true
Is.bigInt([1n, 2n, 3], true); // It returns: false
```

#### Is.number(value: any, each = false): boolean

```javascript
// Check the value is a number
Is.number(-123); // It returns: true

const n = Is.number('123');

// Check the value is a signed number
Is.sNumber(123); // It returns: false

// Check the value is a unsigned number
Is.uNumber(123.456); // It returns: true

// Check for each element of the array
Is.number([1, 1.5, 2], true); // It returns: true
Is.uNumber([1, 2, 3], true); // It returns: true
Is.sNumber([1, 2, 3], true); // It returns: false
```

#### Is.undefined(value: any, each = false): boolean

```javascript
// Check the value is undefined
Is.undefined(undefined); // It returns: true

// Check for each element of the array
Is.undefined([undefined, null], true); // It returns: false
```

#### Is.null(value: any, each = false): boolean

```javascript
// Check the value is null
Is.null(null); // It returns: true

// Check for each element of the array
Is.null([undefined, null], true); // It returns: false
```

#### Is.object(value: any, options?: { rules: ObjectCommonType; suitable?: boolean }): boolean

```javascript
// Check the value is a valid object key-value pair
Is.object(null); // It returns: false
Is.object({}); // It returns: true
Is.object([]); // It returns: false

// Check and validate the object

// Must only "foo" property
Is.object({ foo: 123, bar: 456 }, { rules: { foo: 'number' } }); // It returns: false

// Check rules only
Is.object({ foo: 123, bar: 456 }, { rules: { foo: 'number' }, suitable: false }); // It returns: true

// Matched any properties
Is.object({ foo: 123, bar: false }, { rules: { foo: 'number', bar: 'boolean' } }); // It returns: true

// Deep check
Is.object({ foo: 123, bar: false }, { rules: { foo: 'number', bar: { number: 'number' } } }); // It returns: false
```

#### Is.array(value: any, options?: { rules: CommonType | ObjectCommonType; suitable?: boolean; notEmpty?: boolean }): boolean

```javascript
// Check the value is a valid array
Is.array({}); // It returns: false
Is.array([1, 2, 3]); // It returns: true

// Check and validate each element of the array
Is.array([1, 2, 3], { rules: 'uint' }); // It returns: true
Is.array([1, 2, -3], { rules: 'sint' }); // It returns: false
Is.array([{ foo: 123, bar: 456 }], { rules: { foo: 'number', bar: 'string' } }); // It returns: false
Is.array([{ foo: 123, bar: 456 }], { rules: { foo: 'number' } }); // It returns: false

// Defaults of suitable is true, the object must be matched with the option rules
Is.array([{ foo: 123, bar: 456 }], { rules: { foo: 'number' }, suitable: false }); // It returns: true
Is.array([{ foo: 123, bar: false }], { rules: { foo: 'number', bar: 'boolean' } }); // It returns: true
Is.array([{ foo: 123, bar: false }], { rules: { foo: 'number', bar: { number: 'number' } } }); // It returns: false
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

#### @deprecated Is.flatValue(value: any): boolean

```javascript
// Is.primitive(value: any): boolean

Is.primitive(123); // It returns: true
Is.primitive(-123); // It returns: true
Is.primitive(null); // It returns: true
Is.primitive(void 0); // It returns: true
Is.primitive(''); // It returns: true
Is.primitive(true); // It returns: true
Is.primitive(false); // It returns: true
Is.primitive(NaN); // It returns: true
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

#### Is.nothing(value: any): boolean

```javascript
// Check the value is null | undefined | NaN
Is.nothing(null); // It returns: true
Is.nothing(undefined); // It returns: true
Is.nothing(NaN); // It returns: true
Is.nothing(false); // It returns: false

const arr = [{ foo: 123, bar: { number: { digit: 123 } } }];
Is.array(arr, { rules: { foo: 'number', bar: { number: { digit: 'uint' } } } }); // It returns: true
```

#### Is.strongPassword(value: string, options?: { minLength?: number; noSpaces?: boolean; minSpecialChars?: number; minUpper?: number; minLower?: number; minNumber?: number; }): boolean

```javascript
// Check the value is a strong password, returns false if the value is not a string
const pwd = 'MyStrongPwd@123';
Is.strongPassword(pwd); // It returns: true
Is.strongPassword(pwd, { minLength: pwd.length + 1 }); // It returns: false
Is.strongPassword('MyWeakPwd@'); // It returns: false
Is.strongPassword(`${pwd} has space`); // It returns: false
Is.strongPassword(`${pwd} has space`, { noSpaces: false }); // It returns: true
```

#### Is.flatObject(value: any, allowArray?: boolean | { root?: boolean; deep?: boolean }): boolean

```javascript
// The flat object contains all the properties which are flat value (primitive)
Is.flatObject({ foo: new Map(), bar: new Set() }); // It returns: false

// Defaults to allow deep properties as array
Is.flatObject({ foo: 1, bar: [{ bar: 2 }] }); // It returns: true

// Don't allow deep properties as  array
Is.flatObject({ foo: 1, bar: [{ bar: 2 }] }, false); // It returns: false

// More options: Allow properies as array on root level and don't allow properties as array on deep level
Is.flatObject({ foo: 1, bar: [{ bar: 2 }] }, { root: false, deep: true }); // It returns: false
Is.flatObject({ foo: 1, bar: 2 }, { root: false, deep: true }); // It returns: true
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
Is.includes({ foo: 1, bar: 2 }, { bar: '2' }); // It returns: false
Is.includes({ foo: 1, bar: 2 }, { deep: { foo: 123, bar: 456 } }); // It returns: false
Is.includes({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, { deep: { foo: 123, bar: 456 } }); // It returns: true

// Otherwise will returns false
Is.includes(123, 'string'); // It returns: false
Is.includes('string', false); // It returns: false
Is.includes(null, 'string'); // It returns: false
Is.includes({}, false); // It returns: false
```

#### Is.class(value: any, each = false): boolean

```javascript
Is.class(class Foo {}); // It returns: true
Is.class([class Foo {}, class Bar {}], true); // It returns: true
Is.class(function () {}); // It returns: false
```

#### static mongoId(value: any, each = false): boolean

```javascript
Is.mongoId('507f1f77bcf86cd799439011'); // It returns: true
Is.mongoId(['507f1f77bcf86cd799439011', '507f191e810c19729de860ea'], true); // It returns: true
Is.mongoId(1); // It returns: false
Is.mongoId([1, 2], true); // It returns: false
```

#### static creditCard(value: any, type?: CreditCardType, each = false): boolean\

```javascript
Is.creditCard('4000056655665556', 'VISA'); // It returns: true
Is.creditCard('2223003122003222', 'MASTERCARD'); // It returns: true
Is.creditCard('6011111111111117', 'DISCOVER'); // It returns: true
Is.creditCard('36227206271667', 'DINERS'); // It returns: true
Is.creditCard('3566002020360505', 'JCB'); // It returns: true
```

#### Is.valid<T extends IsValidType>(value: any, options: IsValidOptions<T>): boolean

```javascript
// Validate the value with the specific options
Is.valid('I am a string', { type: 'string' }); // It returns: true
Is.valid(['Str 1', 'Str 2'], { type: 'string', each: true }); // It returns: true
Is.valid(['Str 1', 'Str 2', 3], { type: 'string', each: true }); // It returns: false
Is.valid({}, { type: 'object' }); // It returns: true
Is.valid({ foo: 1, bar: false }, { type: 'object', meta: { suitable: true, rules: { foo: 'number', bar: 'boolean' } } }); // It returns: true
Is.valid({ foo: 1, bar: false }, { type: 'flatObject' }); // It returns: true
Is.valid({ foo: 1, bar: false }, { type: 'objectOrArray', meta: { object: { rules: { foo: 'number', bar: 'boolean' } } } }); // It returns: true
Is.valid([{ foo: 1, bar: false }], { type: 'objectOrArray', meta: { array: { rules: { foo: 'number', bar: 'boolean' } } } }); // It returns: true
Is.valid([{ foo: 123, bar: 456 }], { type: 'array', meta: { rules: { foo: 'number' }, suitable: false } }); // It returns: true
Is.valid([{ foo: 123, bar: 456 }], { type: 'array', meta: { rules: { foo: 'number' }, suitable: true } }); // It returns: false
Is.valid({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, { type: 'includes', meta: { deep: { foo: 123, bar: 456 } } }); // It returns: true
Is.valid(class Foo {}, { type: 'class' }); // It returns: true
Is.valid(['4242424242424242', '4000056655665556'], { type: 'creditCard', each: true, meta: 'VISA' }); // It returns: true
Is.valid(['5555555555554444', '2223003122003222', '5105105105105100'], { type: 'creditCard', each: true, meta: 'MASTERCARD' }); // It returns: true
Is.valid(['6011111111111117', '6011000990139424', '6011981111111113'], { type: 'creditCard', each: true, meta: 'DISCOVER' }); // It returns: true
Is.valid(['3056930009020004', '36227206271667'], { type: 'creditCard', each: true, meta: 'DINERS' }); // It returns: true
```
