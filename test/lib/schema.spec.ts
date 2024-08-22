import { Schema, Util } from '../../src';
import { FooSchema, BarSchema } from '../../src/test';

it('Core Schema', async () => {
   // # Schema.string(options?: IsStringOptions): StringSchema
   expect(Schema.string().check(null)).toBeFalsy();
   expect(Schema.string().optional().check(null)).toBeTruthy();
   expect(Schema.string().nullable().check(null)).toBeTruthy();
   expect(Schema.string().nullable(false).check(null)).toBeFalsy();
   expect(Schema.string().check('')).toBeTruthy();
   expect(Schema.string().minLength(1).check('')).toBeFalsy();
   expect(Schema.string().minLength(0).check('')).toBeTruthy();
   expect(Schema.string().format('dateTime').check('2024-07-03T00:00:00.00')).toBeTruthy();
   expect(Schema.string().format('mongoId').check('507f1f77bcf86cd799439011')).toBeTruthy();
   expect(Schema.string().format('ipv4').check('192.168.1.1')).toBeTruthy();
   expect(Schema.string().format('ipv6').check('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBeTruthy();
   expect(Schema.string().format('mongoId').check('507f1f77bcf86cd799439011')).toBeTruthy();
   expect(Schema.string().format('email').check('example.email.com')).toBeFalsy();
   expect(Schema.string().format('email').check('example@email.com')).toBeTruthy();
   expect(Schema.string().format('creditCard').check('4000056655665556')).toBeTruthy();
   expect(Schema.string().format('uri').check('https://www.domain.com/remove-an-item-from-an-array-in-javascript/')).toBeTruthy();
   expect(Schema.string().format('base64').check('SGVsbG8gV29ybGQ=')).toBeTruthy();
   expect(Schema.string().format('md5').check('3e25960a79dbc69b674cd4ec67a72c62')).toBeTruthy();
   expect(Schema.string().format('sha1').check('7b502c3a1f48c8609ae212cdfb639dee39673f5e')).toBeTruthy();
   expect(Schema.string().format('sha256').check('64ec88ca00b268e5ba1a35678a1b5316d212f4f366b2477232534a8aeca37f3c')).toBeTruthy();
   expect(Schema.string().format('uuid').check('f47ac10b-58cc-4372-a567-0e02b2c3d479')).toBeTruthy();
   const jwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
   expect(Schema.string().format('jwt').check(jwt)).toBeTruthy();

   const regex = /^[0-9a-fA-F]{24}$/;
   expect(Schema.string().format(regex).check('507f1f77bcf86cd799439011')).toBeTruthy();
   expect(Schema.string().format(regex).check('507f1f77bcf86cd79943901g')).toBeFalsy();
   expect(Schema.string().strongPassword().check('MyStrongPwd@123')).toBeTruthy();
   expect(Schema.string().strongPassword({ minLength: 16 }).check('MyStrongPwd@123')).toBeFalsy();

   // ## Number and Boolean format, will auto transform to thr right format
   const stringFormat = Schema.string().format('boolean');
   expect(stringFormat.check('true')).toBeTruthy();
   expect(stringFormat.getValue()).toBeTruthy();

   stringFormat.format('number');
   expect(stringFormat.check('1.25')).toBeTruthy();
   expect(stringFormat.getValue()).toEqual(1.25);

   stringFormat.format('unsignedNumber');
   expect(stringFormat.check('-1.25')).toBeFalsy();
   expect(stringFormat.check('1.25')).toBeTruthy();
   expect(stringFormat.getValue()).toEqual(1.25);

   stringFormat.format('integer');
   expect(stringFormat.check('-1.25')).toBeFalsy();
   expect(stringFormat.check('1')).toBeTruthy();
   expect(stringFormat.check('1.0')).toBeTruthy();
   expect(stringFormat.getValue()).toEqual(1);

   stringFormat.format('unsignedInteger');
   expect(stringFormat.check('-1')).toBeFalsy();
   expect(stringFormat.check('1')).toBeTruthy();
   expect(stringFormat.check('1.0')).toBeTruthy();
   expect(stringFormat.getValue()).toEqual(1);

   // # Schema.boolean(options?: IsBaseOptions): BooleanSchema
   expect(Schema.boolean().check(1)).toBeFalsy();
   expect(Schema.boolean().check(true)).toBeTruthy();
   expect(Schema.boolean().check(false)).toBeTruthy();
   expect(Schema.boolean().check([1, true])).toBeFalsy();
   expect(Schema.boolean().check([false, true])).toBeFalsy();

   // # Schema.number(options?: IsNumberOptions): NumberSchema
   expect(Schema.number().check(1)).toBeTruthy();
   expect(Schema.number().check([1, 2, 3])).toBeFalsy();
   expect(Schema.number().check(1.25)).toBeTruthy();
   expect(Schema.number().integer().check(1.25)).toBeFalsy();
   expect(Schema.number().integer().min(3).check(2)).toBeFalsy();
   expect(Schema.number().integer().max(10).check(12)).toBeFalsy();
   expect(Schema.number().integer().max(10).check(9)).toBeTruthy();

   // # Schema.enum(emum: EnumElement[]): EnumSchema
   expect(Schema.enum(['Active', 'Inactive', true, false, 1, 0]).check('Inactive')).toBeTruthy();
   expect(Schema.enum(['Active', 'Inactive', true, false, 1, 0]).check(null)).toBeFalsy();

   // # Object & Array
   // ## Schema.object<T extends object>(properties?: ObjectSchemaProps<T>): ObjectSchema<T>
   // ## array<T extends ItemSchema | ItemSchema[]>(itemsProps?: T): ArraySchema<T>
   expect(Schema.object().check({})).toBeTruthy();
   expect(Schema.object().check([])).toBeFalsy();
   expect(Schema.array().check([])).toBeTruthy();
   expect(Schema.array(Schema.number()).check([1, 1.5])).toBeTruthy();
   expect(Schema.array(Schema.number()).check([1, 1.5, true])).toBeFalsy();

   // # Deep Object/Array schema
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
   });

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

   expect(schema.check(validValue)).toBeTruthy();
   const invalidValue = { noAcceptProp: 'OOps!', ...Util.clone(validValue) };

   expect(schema.check(invalidValue)).toBeFalsy();

   // Revert string value
   invalidValue.minLength2 = '12';
   expect(schema.whiteList().check(invalidValue)).toBeTruthy();
   expect(invalidValue).not.toHaveProperty('noAcceptProp');
   expect(schema.getValue()).not.toHaveProperty('noAcceptProp');
   expect(schema.getValue()).toHaveProperty('minLength2', 12);

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
   });
   expect(objSchema.check(invalidDataValue)).toBeFalsy();

   // ## Not unique array
   expect(Schema.array().unique().check([1, 1, 2])).toBeFalsy();

   // ## Transform from array
   const arr = ['12.5', { h: '<p>Hello World</p>' }];
   const arrSchema = Schema.array([Schema.string().format('number'), Schema.object({ h: Schema.string() })]);
   expect(arrSchema.check(arr)).toBeTruthy();
   expect(arrSchema.getValue()).toHaveProperty('[0]', 12.5);
   expect(arrSchema.getValue()).toHaveProperty('[1].h', 'Hello World');
   // console.log(JSON.stringify(objSchema.getErrors(), null, 2));

   // # Force allow values (for all of schemas)
   const stringSchema = Schema.string()
      .nullable(false)
      .allow(1, true, null, { foo: { deep: 'bar' } });
   expect(stringSchema.check(1)).toBeTruthy();
   expect(stringSchema.check(true)).toBeTruthy();
   expect(stringSchema.check(null)).toBeTruthy(); // null is allowed so it skips the nullable option
   expect(stringSchema.check(false)).toBeFalsy();
   expect(stringSchema.check({ foo: { deep: 'bar' } })).toBeTruthy();

   // # Class ref schema
   const fooClassRef = Schema.classRef(FooSchema);
   expect(fooClassRef.check({ uint: 1, email: 'my@email.com' })).toBeTruthy();

   const barClassRef = Schema.classRef(BarSchema);
   expect(barClassRef.check({ content: 'Something', foo: { uint: 1, email: 'my@email.com' } })).toBeTruthy();
   expect(barClassRef.check({ foo: { uint: 1, email: 'my.email.com' } })).toBeFalsy();
   expect(barClassRef.check({ content: ' Something ', foo: { uint: 1, email: 'my.email.com' } })).toBeFalsy();

   // # Disable validate
   // ## The schema UJS support to export to swagger property (for eg: usage in NestJS), sometime we don't need validate and just for Swagger only
   expect(Schema.number().integer().check(1.25)).toBeFalsy();
   expect(Schema.number().integer().validate(false).check(1.25)).toBeTruthy();
   expect(Schema.number().validate(false).check('Not a number')).toBeTruthy();

   // # Default value
   // ## Set the default value when the check data is undefined
   const number = Schema.number().optional().default(123);
   number.check(undefined);
   expect(number.getValue()).toEqual(123);

   // ## Ignore default value when the value is allowed values
   number.allow([null]);
   number.check(null);
   expect(number.getValue()).toEqual(null);
});
