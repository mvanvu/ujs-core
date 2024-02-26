import { DateTime } from '../../src';

it('Util Datetime', () => {
   const date = new Date();
   const datetime = DateTime.from(date);
   expect(datetime.native).toEqual(date);
   expect(DateTime.now().startOf().eq(DateTime.yesterday().addDate(1).startOf()));

   // Clone
   const clone = datetime.clone();
   clone.addDate(1);
   expect(clone.native.getDate() - 1 === date.getDate());
   expect(datetime.native.getDate() - 1 < date.getDate());
   expect(clone.gt(date));
   expect(datetime.eq(date));

   // TZ
   datetime.setOffset(DateTime.parseOffset('+08:00'));
   expect(datetime.format('Z')).toEqual('+08:00');
});
