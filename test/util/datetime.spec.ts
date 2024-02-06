import { DateTime } from '../../src';

it('Util Datetime', () => {
   const date = new Date();
   const datetime = DateTime.create(date);
   expect(datetime.native).toEqual(date);

   // Clone
   const clone = datetime.clone();
   clone.add(1, 'day');
   expect(clone.native.getDate() - 1 === date.getDate());
   expect(datetime.native.getDate() - 1 < date.getDate());
   expect(clone.isGreater(date));
   expect(datetime.isEquals(date));

   // TZ
   datetime.setOffset(DateTime.parseOffset('+08:00'));
   expect(datetime.format('Z')).toEqual('+08:00');
});
