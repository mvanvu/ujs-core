## Schema

### Usage

```javascript
import { Schema, Util } from '@mvanvu/ujs';
```

#### Schema.string(options?: IsStringOptions): StringSchema

```javascript
Schema.string().check(null); // It returns: false
Schema.string().optional().check(null); // It returns: true
Schema.string().nullable().check(null); // It returns: true
Schema.string().nullable(false).check(null); // It returns: false
Schema.string().check(''); // It returns: true
Schema.string().minLength(1).check(''); // It returns: false
Schema.string().minLength(0).check(''); // It returns: true
Schema.string().format('dateTime').check('2024-07-03T00:00:00.00'); // It returns: true
Schema.string().format('mongoId').check('507f1f77bcf86cd799439011'); // It returns: true
Schema.string().format('ipv4').check('192.168.1.1'); // It returns: true
Schema.string().format('ipv6').check('2001:0db8:85a3:0000:0000:8a2e:0370:7334'); // It returns: true
Schema.string().format('mongoId').check('507f1f77bcf86cd799439011'); // It returns: true
Schema.string().format('email').check('example.email.com'); // It returns: false
Schema.string().format('email').check('example@email.com'); // It returns: true
Schema.string().format('creditCard').check('4000056655665556'); // It returns: true
Schema.string().format('uri').check('https://www.domain.com/remove-an-item-from-an-array-in-javascript/'); // It returns: true
Schema.string().format('base64').check('SGVsbG8gV29ybGQ='); // It returns: true
Schema.string().format('md5').check('3e25960a79dbc69b674cd4ec67a72c62'); // It returns: true
Schema.string().format('sha1').check('7b502c3a1f48c8609ae212cdfb639dee39673f5e'); // It returns: true
Schema.string().format('sha256').check('64ec88ca00b268e5ba1a35678a1b5316d212f4f366b2477232534a8aeca37f3c'); // It returns: true
Schema.string().format('uuid').check('f47ac10b-58cc-4372-a567-0e02b2c3d479'); // It returns: true
const jwt =
   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
Schema.string().format('jwt').check(jwt); // It returns: true

const regex = /^[0-9a-fA-F]{24}$/;
Schema.string().format(regex).check('507f1f77bcf86cd799439011'); // It returns: true
Schema.string().format(regex).check('507f1f77bcf86cd79943901g'); // It returns: false
Schema.string().strongPassword().check('MyStrongPwd@123'); // It returns: true
Schema.string().strongPassword({ minLength: 16 }).check('MyStrongPwd@123'); // It returns: false

// Number and Boolean format, will auto transform to thr right format
const stringFormat = Schema.string().format('boolean');
stringFormat.check('true'); // It returns: true
stringFormat.getValue(); // It returns: true

stringFormat.format('number');
stringFormat.check('1.25'); // It returns: true
stringFormat.getValue(); // It returns: 1.25

stringFormat.format('unsignedNumber');
stringFormat.check('-1.25'); // It returns: false
stringFormat.check('1.25'); // It returns: true
stringFormat.getValue(); // It returns: 1.25

stringFormat.format('integer');
stringFormat.check('-1.25'); // It returns: false
stringFormat.check('1'); // It returns: true
stringFormat.check('1.0'); // It returns: true
stringFormat.getValue(); // It returns: 1

stringFormat.format('unsignedInteger');
stringFormat.check('-1'); // It returns: false
stringFormat.check('1'); // It returns: true
stringFormat.check('1.0'); // It returns: true
stringFormat.getValue(); // It returns: 1
```

#### Schema.boolean(options?: IsBaseOptions): BooleanSchema

```javascript
Schema.boolean().check(1); // It returns: false
Schema.boolean().check(true); // It returns: true
Schema.boolean().check(false); // It returns: true
Schema.boolean().check([1, true]); // It returns: false
Schema.boolean().check([false, true]); // It returns: false
```

#### Schema.number(options?: IsNumberOptions): NumberSchema

```javascript
Schema.number().check(1); // It returns: true
Schema.number().check([1, 2, 3]); // It returns: false
Schema.number().check(1.25); // It returns: true
Schema.number().integer().check(1.25); // It returns: false
Schema.number().integer().min(3).check(2); // It returns: false
Schema.number().integer().max(10).check(12); // It returns: false
Schema.number().integer().max(10).check(9); // It returns: true
```

#### Schema.enum(emum: EnumElement[]): EnumSchema

```javascript
Schema.enum(['Active', 'Inactive', true, false, 1, 0]).check('Inactive'); // It returns: true
Schema.enum(['Active', 'Inactive', true, false, 1, 0]).check(null); // It returns: false
```

#### Object & Array

```javascript
// Schema.object<T extends object>(properties?: ObjectSchemaProps<T>): ObjectSchema<T>

// array<T extends ItemSchema | ItemSchema[]>(itemsProps?: T): ArraySchema<T>
Schema.object().check({}); // It returns: true
Schema.object().check([]); // It returns: false
Schema.array().check([]); // It returns: true
Schema.array(Schema.number()).check([1, 1.5]); // It returns: true
Schema.array(Schema.number()).check([1, 1.5, true]); // It returns: false
```

#### Deep Object/Array schema

```javascript
const schema = Schema.object({
foo: Schema.number(),
bar: Schema.object({ bar2: Schema.boolean() }),
arrayAny: Schema.array(),
arrayNumber: Schema.array(Schema.number()),
arrayNumberBoolean: Schema.array([Schema.number(), Schema.boolean()]),
arrayObject: Schema.array(
Schema.object({
number: Schema.number(),
integer: Schema.number().integer(),
boolean: Schema.boolean(),
object: Schema.object({ array: Schema.array(Schema.array(Schema.number())) }),
}).whiteList(),
),
email: Schema.string().format('email'),
minLength2: Schema.string().minLength(2).format('unsignedInteger'),
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
const invalidValue = { noAcceptProp: 'OOps!', ...Util.clone(validValue) };

schema.check(invalidValue); // It returns: false

// Revert string value
invalidValue.minLength2 = '12';
schema.whiteList().check(invalidValue); // It returns: true
invalidValue; // It returns: [ROOT].'noAcceptProp' === undefined
schema.getValue(); // It returns: [ROOT].'noAcceptProp' === undefined
schema.getValue(); // It returns: [ROOT].'minLength2' ===  12

const invalidDataValue = {
num: '1',
obj: { num: true, bool: 1, bar: { array: 1 }, enum: ['Active', 'Inactive'], string: '1234', deep: { number: -1.4 } },
arr: [
123,
true,
{
foo: 456,
bar: {
blab: 1.25,
},
},
],
};
const objSchema = Schema.object<typeof invalidDataValue>({
num: Schema.number(),
obj: Schema.object<(typeof invalidDataValue)['obj']>({
num: Schema.number(),
bool: Schema.boolean(),
bar: Schema.array(Schema.object({ bar: Schema.array(Schema.string()) })),
enum: Schema.enum([1, 0]),
string: Schema.string().minLength(5).format('email'),
deep: Schema.object({ number: Schema.number().integer().min(-1) }),
}),
arr: Schema.array([
Schema.number(),
Schema.string(),
Schema.object({ foo: Schema.boolean(), bar: Schema.object({ blab: Schema.number().integer().min(2) }) }),
]),
objSchema.check(invalidDataValue); // It returns: false


// Not unique array
Schema.array().unique().check([1, 1, 2]); // It returns: false


// Transform from array
const arr = ['12.5', { h: '<p>Hello World</p>' }];
const arrSchema = Schema.array([Schema.string().format('number'), Schema.object({ h: Schema.string() })]);
arrSchema.check(arr); // It returns: true
arrSchema.getValue(); // It returns: [ROOT].'[0]' ===  12.5
arrSchema.getValue(); // It returns: [ROOT].'[1].h' ===  'Hello World'
// console.log(JSON.stringify(objSchema.getErrors(), null, 2));

```

#### Force allow values (for all of schemas)

```javascript
const stringSchema = Schema.string()
   .nullable(false)
   .allow(1, true, null, { foo: { deep: 'bar' } });
stringSchema.check(1); // It returns: true
stringSchema.check(true); // It returns: true
expect(stringSchema.check(null)).toBeTruthy(); // null is allowed so it skips the nullable option
stringSchema.check(false); // It returns: false
stringSchema.check({ foo: { deep: 'bar' } }); // It returns: true
```

#### Class ref schema

```javascript
const fooClassRef = Schema.classRef(FooSchema);
fooClassRef.check({ uint: 1, email: 'my@email.com' }); // It returns: true

const barClassRef = Schema.classRef(BarSchema);
barClassRef.check({ content: 'Something', foo: { uint: 1, email: 'my@email.com' } }); // It returns: true
barClassRef.check({ foo: { uint: 1, email: 'my.email.com' } }); // It returns: false
barClassRef.check({ content: ' Something ', foo: { uint: 1, email: 'my.email.com' } }); // It returns: false
```

#### Disable validate

```javascript
// The schema UJS support to export to swagger property (for eg: usage in NestJS), sometime we don't need validate and just for Swagger only
Schema.number().integer().check(1.25); // It returns: false
Schema.number().integer().validate(false).check(1.25); // It returns: true
Schema.number().validate(false).check('Not a number'); // It returns: true
```
