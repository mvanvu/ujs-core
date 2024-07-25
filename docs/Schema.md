## Schema

### Usage

```javascript
import { Schema } from '@mvanvu/ujs';
```

#### Schema.string(): StringSchema

```javascript
Schema.string().check(null); // It returns: false
Schema.string().optional().check(null); // It returns: true
Schema.string().nullable().check(null); // It returns: true
Schema.string().nullable(false).check(null); // It returns: false
Schema.string().check(''); // It returns: true
Schema.string().notEmpty().check(''); // It returns: false
Schema.string().notEmpty(false).check(''); // It returns: true
Schema.string().format('date-time').check('2024-07-03T00:00:00.00'); // It returns: true
Schema.string().format('mongoId').check('507f1f77bcf86cd799439011'); // It returns: true
Schema.string().format('ipV4').check('192.168.1.1'); // It returns: true
Schema.string().format('ipV6').check('2001:0db8:85a3:0000:0000:8a2e:0370:7334'); // It returns: true
Schema.string().format('mongoId').check('507f1f77bcf86cd799439011'); // It returns: true
Schema.string().format('email').check('example.email.com'); // It returns: false
Schema.string().format('email').check('example@email.com'); // It returns: true
Schema.string().format('creditCard').check('4000056655665556'); // It returns: true
Schema.string().format('url').check('https://www.domain.com/remove-an-item-from-an-array-in-javascript/'); // It returns: true
Schema.string().format('base64').check('SGVsbG8gV29ybGQ='); // It returns: true
Schema.string().format('md5').check('3e25960a79dbc69b674cd4ec67a72c62'); // It returns: true
Schema.string().format('sha1').check('7b502c3a1f48c8609ae212cdfb639dee39673f5e'); // It returns: true
Schema.string().format('sha256').check('64ec88ca00b268e5ba1a35678a1b5316d212f4f366b2477232534a8aeca37f3c'); // It returns: true
Schema.string().format('uuid').check('f47ac10b-58cc-4372-a567-0e02b2c3d479'); // It returns: true
const jwt =
   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
Schema.string().format('jwt').check(jwt); // It returns: true
```

#### Schema.boolean(): BooleanSchema

```javascript
Schema.boolean().check(1); // It returns: false
Schema.boolean().check(true); // It returns: true
Schema.boolean().check(false); // It returns: true
Schema.boolean().check([1, true]); // It returns: false
Schema.boolean().check([false, true]); // It returns: false
Schema.boolean().isArray().check([false, true]); // It returns: true
Schema.boolean().isArray('unique').check([false, false, true]); // It returns: false
```

#### Schema.number(): NumberSchema

```javascript
Schema.number().check(1); // It returns: true
Schema.number().check([1, 2, 3]); // It returns: false
Schema.number().isArray().check([1, 2, 3]); // It returns: true
Schema.number().check(1.25); // It returns: true
Schema.number().integer().check(1.25); // It returns: false
Schema.number().integer().min(3).check(2); // It returns: false
Schema.number().integer().max(10).check(12); // It returns: false
Schema.number().integer().max(10).check(9); // It returns: true
```

#### Object & Array

```javascript
// Schema.object(): ObjectSchema

// Schema.array(): ArraySchema
Schema.object().check({}); // It returns: true
Schema.object().check([]); // It returns: false
Schema.array().check([]); // It returns: true
Schema.array().items(Schema.number()).check([1, 1.5]); // It returns: true
Schema.array().items(Schema.number()).check([1, 1.5, true]); // It returns: false
```

#### Deep Object/Array schema

```javascript
const schema = Schema.object().props({
foo: Schema.number(),
bar: Schema.object().props({
bar2: Schema.boolean(),
}),
arrayAny: Schema.array(),
arrayNumber: Schema.array().items(Schema.number()),
arrayNumberBoolean: Schema.array().items([Schema.number(), Schema.boolean()]),
arrayObject: Schema.array().items(
Schema.object()
.whiteList()
.props({
number: Schema.number(),
integer: Schema.number().integer(),
boolean: Schema.boolean(),
object: Schema.object().props({
array: Schema.array().items(Schema.array().items(Schema.number())),
}),
}),
),
email: Schema.string().format('email'),
minLength2: Schema.string().minLength(2),
optional: Schema.string().optional(),
nullable: Schema.string().nullable(),

const validValue = {
foo: 123,
bar: { bar2: true },
arrayAny: ['1', 2, true, [], {}],
arrayNumber: [1, 2.5, 3],
arrayNumberBoolean: [123, false],
arrayObject: [
{
number: 1.5,
integer: 1,
boolean: false,
object: {
array: [
[123, 456],
[789, 11112],
],
},
},
],
email: 'admin@email.com',
minLength2: '12',
// optional: undefined, // No need to set undefined as it's already as undefined
nullable: null,
};

schema.check(validValue); // It returns: true

const invalidValue = {
foo: 123,
bar: { bar2: true, noAcceptProp: 'OOps!' },
arrayAny: ['1', 2, true, [], {}],
arrayNumber: [1, 2.5, 3],
arrayNumberBoolean: [123, false],
arrayObject: [
{
number: 1.5,
integer: 1,
boolean: false,
object: {
array: [
[123, 456],
[789, 11112],
],
},
noAcceptProp: 'OOps!',
},
],
email: 'admin@email.com',
minLength2: '12',
nullable: null,
noAcceptProp: 'OOps!',
};

schema.check(invalidValue); // It returns: false
schema.whiteList().check(invalidValue); // It returns: true
invalidValue; // It returns: [ROOT].'noAcceptProp' === undefined
invalidValue.bar; // It returns: [ROOT].'noAcceptProp' === undefined
invalidValue.arrayObject[0]; // It returns: [ROOT].'noAcceptProp' === undefined
```
