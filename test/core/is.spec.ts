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
   expect(Is.sInt(1)).toBeFalsy();
   expect(Is.uInt(-123.4)).toBeFalsy();
   expect(Is.bigInt(1)).toBeFalsy();
   expect(Is.bigInt(1n)).toBeTruthy();
   expect(Is.sBigInt(-1n)).toBeTruthy();
   expect(Is.uBigInt(1n)).toBeTruthy();
   expect(Is.number(-123)).toBeTruthy();
   expect(Is.sNumber(123)).toBeFalsy();
   expect(Is.uNumber(123.456)).toBeTruthy();
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
   const date2 = DateTime.from(date).native;
   expect(Is.equals(date, date2)).toBeTruthy();
   expect(Is.equals(date, DateTime.from(date))).toBeTruthy();

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

   // Suitable object (advance object)
   expect(Is.suitableObject({ foo: 123, bar: 456 }, { rules: { foo: 'number' } })).toBeFalsy();
   expect(Is.suitableObject({ foo: 123, bar: 456 }, { rules: { foo: 'number' }, suitable: false })).toBeTruthy();
   expect(Is.suitableObject({ foo: 123, bar: false }, { rules: { foo: 'number', bar: 'boolean' } })).toBeTruthy();
   expect(Is.suitableObject({ foo: 123, bar: false }, { rules: { foo: 'number', bar: { number: 'number' } } })).toBeFalsy();

   // Array
   expect(Is.array({})).toBeFalsy();
   expect(Is.array([1, 2, 3])).toBeTruthy();
   expect(Is.array([1, 2, 3], { rules: 'uint' })).toBeTruthy();
   expect(Is.array([1, 2, -3], { rules: 'sint' })).toBeFalsy();
   expect(Is.array([{ foo: 123, bar: 456 }], { rules: { foo: 'number', bar: 'string' } })).toBeFalsy();
   expect(Is.array([{ foo: 123, bar: 456 }], { rules: { foo: 'number' } })).toBeFalsy();
   expect(Is.array([{ foo: 123, bar: 456 }], { rules: { foo: 'number' }, suitable: false })).toBeTruthy();
   expect(Is.array([{ foo: 123, bar: false }], { rules: { foo: 'number', bar: 'boolean' } })).toBeTruthy();
   expect(Is.array([{ foo: 123, bar: false }], { rules: { foo: 'number', bar: { number: 'number' } } })).toBeFalsy();
   expect(
      Is.array([{ foo: 123, bar: { number: { digit: 123 } } }], {
         rules: { foo: 'number', bar: { number: { digit: 'uint' } } },
      }),
   ).toBeTruthy();

   // Strong password
   const pwd = 'MyStrongPwd@123';
   expect(Is.strongPassword(pwd)).toBeTruthy();
   expect(Is.strongPassword(pwd, { minLength: pwd.length + 1 })).toBeFalsy();
   expect(Is.strongPassword('MyWeakPwd@')).toBeFalsy();
   expect(Is.strongPassword(`${pwd} has space`)).toBeFalsy();
   expect(Is.strongPassword(`${pwd} has space`, { noSpaces: false })).toBeTruthy();

   // Flat object
   expect(Is.flatObject({ foo: new Map(), bar: new Set() })).toBeFalsy();
   expect(Is.flatObject({ foo: 1, bar: [{ bar: 2 }] })).toBeTruthy();
   expect(Is.flatObject({ foo: 1, bar: [{ bar: 2 }] }, false)).toBeFalsy();
   expect(Is.flatObject({ foo: 1, bar: [{ bar: 2 }] }, { root: false, deep: true })).toBeTruthy();
});
