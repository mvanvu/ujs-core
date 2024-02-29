## Is

### Usage

```javascript
import { Is, DateTime } from '@maivubc/ujs';
```

### Empty Object

```javascript
Is.emptyObject(null); // It returns: false
Is.emptyObject([]); // It returns: false
Is.emptyObject({ foo: 'bar' }); // It returns: false
Is.emptyObject({}); // It returns: true
```

### Date

```javascript
Is.date(new Date()); // It returns: true
Is.date(DateTime.now()); // It returns: true
Is.date('2024-02-28'); // It returns: true
Is.date(''); // It returns: false
```

### Async Function

```javascript
Is.asyncFunc(null); // It returns: false
Is.asyncFunc(() => {}); // It returns: false
Is.asyncFunc(async () => {}); // It returns: true
```

### Common Type

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
   'date';        -> DateTimeLike (number | string | Date (native) | DateTime)
*/

Is.int(123); // It returns: true
Is.sInt(1); // It returns: false
Is.uInt(-123.4); // It returns: false
Is.bigInt(1); // It returns: false
Is.bigInt(1n); // It returns: true
Is.sBigInt(-1n); // It returns: true
Is.uBigInt(1n); // It returns: true
Is.number(-123); // It returns: true
Is.sNumber(123); // It returns: false
Is.uNumber(123.456); // It returns: true
Is.undefined(undefined); // It returns: true
Is.null(null); // It returns: true
Is.object(null); // It returns: false
Is.object({}); // It returns: true
Is.object([]); // It returns: false
Is.array([]); // It returns: true
```

### Equals

```javascript
Is.equals(123, '123'); // It returns: false
Is.equals(undefined, null); // It returns: false
Is.equals(123, 123); // It returns: true

const date = new Date();
const date2 = DateTime.from(date).native;
Is.equals(date, date2); // It returns: true
Is.equals(date, DateTime.from(date)); // It returns: true

// Deep
Is.equals({}, {}); // It returns: true
Is.equals({ foo: 'bar', bar: 123 }, { bar: 123, foo: 'bar' }); // It returns: true
Is.equals({ foo: 'bar', bar: 123 }, { bar: 123, foo: 'bar2' }); // It returns: false
Is.equals({ foo: 'bar', bar: 123 }, { bar: 123 }); // It returns: false
```

### Flat value

```javascript

```

### The flat value is a primitive value

```javascript
Is.flatValue(123); // It returns: true
Is.flatValue(-123); // It returns: true
Is.flatValue(null); // It returns: true
Is.flatValue(void 0); // It returns: true
Is.flatValue(''); // It returns: true
Is.flatValue(true); // It returns: true
Is.flatValue(false); // It returns: true
Is.flatValue(NaN); // It returns: true
Is.flatValue([]); // It returns: false
Is.flatValue({}); // It returns: false
Is.flatValue(() => {}); // It returns: false
Is.flatValue(new Set()); // It returns: false
Is.flatValue(new Map()); // It returns: false
```

### Empty

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

### Nothing

```javascript
Is.nothing(null); // It returns: true
Is.nothing(undefined); // It returns: true
Is.nothing(NaN); // It returns: true
Is.nothing(false); // It returns: false
```

### Object

```javascript
Is.object(null); // It returns: false
Is.object([]); // It returns: false
Is.object({}); // It returns: true

// Must only "foo" property
Is.object({ foo: 123, bar: 456 }, { rules: { foo: 'number' } }); // It returns: false

// Check rules only
Is.object({ foo: 123, bar: 456 }, { rules: { foo: 'number' }, suitable: false }); // It returns: true

// Matched any properties
Is.object({ foo: 123, bar: false }, { rules: { foo: 'number', bar: 'boolean' } }); // It returns: true

// Deep check
Is.object({ foo: 123, bar: false }, { rules: { foo: 'number', bar: { number: 'number' } } }); // It returns: false
```

### Array

```javascript
Is.array({}); // It returns: false
Is.array([1, 2, 3]); // It returns: true
Is.array([1, 2, 3], { rules: 'uint' }); // It returns: true
Is.array([1, 2, -3], { rules: 'sint' }); // It returns: false
Is.array([{ foo: 123, bar: 456 }], { rules: { foo: 'number', bar: 'string' } }); // It returns: false
Is.array([{ foo: 123, bar: 456 }], { rules: { foo: 'number' } }); // It returns: false
Is.array([{ foo: 123, bar: 456 }], { rules: { foo: 'number' }, suitable: false }); // It returns: true
Is.array([{ foo: 123, bar: false }], { rules: { foo: 'number', bar: 'boolean' } }); // It returns: true
Is.array([{ foo: 123, bar: false }], { rules: { foo: 'number', bar: { number: 'number' } } }); // It returns: false

const arr = [{ foo: 123, bar: { number: { digit: 123 } } }];
Is.array(arr, { rules: { foo: 'number', bar: { number: { digit: 'uint' } } } }); // It returns: true
```

### Strong password

```javascript
const pwd = 'MyStrongPwd@123';
Is.strongPassword(pwd); // It returns: true
Is.strongPassword(pwd, { minLength: pwd.length + 1 }); // It returns: false
Is.strongPassword('MyWeakPwd@'); // It returns: false
Is.strongPassword(`${pwd} has space`); // It returns: false
Is.strongPassword(`${pwd} has space`, { noSpaces: false }); // It returns: true
```

### Flat object: the flat object contains all the properties which are flat value (primitive)

```javascript
Is.flatObject({ foo: new Map(), bar: new Set() }); // It returns: false

// Defaults to allow deep properties as array
Is.flatObject({ foo: 1, bar: [{ bar: 2 }] }); // It returns: true

// Don't allow deep properties as  array
Is.flatObject({ foo: 1, bar: [{ bar: 2 }] }, false); // It returns: false

// More options: Allow properies as array on root level and don't allow properties as array on deep level
Is.flatObject({ foo: 1, bar: [{ bar: 2 }] }, { root: false, deep: true }); // It returns: false
Is.flatObject({ foo: 1, bar: 2 }, { root: false, deep: true }); // It returns: true
```
