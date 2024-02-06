import { Is, DateTime } from '../../src';

it('Util Is', () => {
   // Empty object
   expect(Is.emptyObject({ foo: 'bar' })).toBeFalsy();
   expect(Is.emptyObject({})).toBeTruthy();

   // Date
   expect(Is.date(new Date())).toBeTruthy();
   expect(Is.date(DateTime.now())).toBeTruthy();
   expect(Is.date('')).toBeFalsy();

   // asyncFunc
   expect(Is.asyncFunc(null)).toBeFalsy();
   expect(Is.asyncFunc(() => {})).toBeFalsy();
   expect(Is.asyncFunc(async () => {})).toBeTruthy();

   // Typeof
   expect(Is.typeOf(123, 'int')).toBeTruthy();
   expect(Is.typeOf(-1, 'sint')).toBeFalsy();
   expect(Is.typeOf(123.4, 'uint')).toBeFalsy();
   expect(Is.typeOf(-123, 'number')).toBeTruthy();
   expect(Is.typeOf(-123, 'snumber')).toBeFalsy();
   expect(Is.typeOf(-123.456, 'unumber')).toBeTruthy();
   expect(Is.typeOf(undefined, 'undefined')).toBeTruthy();
   expect(Is.typeOf(null, 'null')).toBeTruthy();
   expect(Is.typeOf(null, 'object')).toBeFalsy();
   expect(Is.typeOf({}, 'object')).toBeTruthy();
   expect(Is.typeOf([], 'object')).toBeFalsy();
   expect(Is.typeOf([], 'array')).toBeTruthy();

   // Equals
   expect(Is.equals(123, '123')).toBeFalsy();
   expect(Is.equals(undefined, null)).toBeFalsy();
   expect(Is.equals(123, 123)).toBeTruthy();
   expect(Is.equals({}, {})).toBeTruthy();
   expect(Is.equals({ foo: 'bar', bar: 123 }, { bar: 123, foo: 'bar' })).toBeTruthy();

   const date = new Date();
   const date2 = DateTime.create(date).native;
   expect(Is.equals(date, date2)).toBeTruthy();
   expect(Is.equals(date, DateTime.create(date))).toBeTruthy();

   // Flat value
   expect(Is.flatValue(123)).toBeTruthy();
   expect(Is.flatValue(-123)).toBeTruthy();
   expect(Is.flatValue(null)).toBeTruthy();
   expect(Is.flatValue(void 0)).toBeTruthy();
   expect(Is.flatValue('')).toBeTruthy();
   expect(Is.flatValue(true)).toBeTruthy();
   expect(Is.flatValue(false)).toBeTruthy();
   expect(Is.flatValue(NaN)).toBeTruthy();
   expect(Is.flatValue([])).toBeFalsy();
   expect(Is.flatValue({})).toBeFalsy();
   expect(Is.flatValue(() => {})).toBeFalsy();
   expect(Is.flatValue(new Set())).toBeFalsy();
   expect(Is.flatValue(new Map())).toBeFalsy();

   // Empty
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

   // Nothing
   expect(Is.nothing(null)).toBeTruthy();
   expect(Is.nothing(undefined)).toBeTruthy();
   expect(Is.nothing(NaN)).toBeTruthy();
   expect(Is.nothing(false)).toBeFalsy();

   // Object
   expect(Is.object(null)).toBeFalsy();
   expect(Is.object([])).toBeFalsy();
   expect(Is.object({})).toBeTruthy();

   // Record (advance object)
   expect(Is.record({ foo: 123, bar: 456 }, { rules: { foo: 'number' } })).toBeFalsy();
   expect(Is.record({ foo: 123, bar: 456 }, { rules: { foo: 'number' }, suitable: false })).toBeTruthy();
   expect(Is.record({ foo: 123, bar: false }, { rules: { foo: 'number', bar: 'boolean' } })).toBeTruthy();
   expect(Is.record({ foo: 123, bar: false }, { rules: { foo: 'number', bar: { number: 'number' } } })).toBeFalsy();

   // Array
   expect(Is.array({})).toBeFalsy();
   expect(Is.array([1, 2, 3])).toBeTruthy();
   expect(Is.array([1, 2, 3], { rules: 'sint' })).toBeTruthy();
   expect(Is.array([1, 2, -3], { rules: 'sint' })).toBeFalsy();
   expect(Is.array([{ foo: 123, bar: 456 }], { rules: { foo: 'number', bar: 'string' } })).toBeFalsy();
   expect(Is.array([{ foo: 123, bar: 456 }], { rules: { foo: 'number' } })).toBeFalsy();
   expect(Is.array([{ foo: 123, bar: 456 }], { rules: { foo: 'number' }, suitable: false })).toBeTruthy();
   expect(Is.array([{ foo: 123, bar: false }], { rules: { foo: 'number', bar: 'boolean' } })).toBeTruthy();
   expect(Is.array([{ foo: 123, bar: false }], { rules: { foo: 'number', bar: { number: 'number' } } })).toBeFalsy();
   expect(
      Is.array([{ foo: 123, bar: { number: { digit: 123 } } }], {
         rules: { foo: 'number', bar: { number: { digit: 'sint' } } },
      }),
   ).toBeTruthy();
});
