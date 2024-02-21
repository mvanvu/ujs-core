import { Is, DateTime } from '../../src';

it('Core Is', () => {
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
   expect(Is.int(123)).toBeTruthy();
   expect(Is.sInt(-1)).toBeFalsy();
   expect(Is.uInt(123.4)).toBeFalsy();
   expect(Is.number(-123)).toBeTruthy();
   expect(Is.sNumber(-123)).toBeFalsy();
   expect(Is.uNumber(-123.456)).toBeTruthy();
   expect(Is.undefined(undefined)).toBeTruthy();
   expect(Is.null(null)).toBeTruthy();
   expect(Is.object(null)).toBeFalsy();
   expect(Is.object({})).toBeTruthy();
   expect(Is.object([])).toBeFalsy();
   expect(Is.array([])).toBeTruthy();

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
   expect(Is.flat(123)).toBeTruthy();
   expect(Is.flat(-123)).toBeTruthy();
   expect(Is.flat(null)).toBeTruthy();
   expect(Is.flat(void 0)).toBeTruthy();
   expect(Is.flat('')).toBeTruthy();
   expect(Is.flat(true)).toBeTruthy();
   expect(Is.flat(false)).toBeTruthy();
   expect(Is.flat(NaN)).toBeTruthy();
   expect(Is.flat([])).toBeFalsy();
   expect(Is.flat({})).toBeFalsy();
   expect(Is.flat(() => {})).toBeFalsy();
   expect(Is.flat(new Set())).toBeFalsy();
   expect(Is.flat(new Map())).toBeFalsy();

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
