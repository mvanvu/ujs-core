import { DateTime } from '../../src';

it('Util DateTime', () => {
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
   datetime.setOffset('+08:00');
   expect(datetime.format('Z')).toEqual('+08:00');

   // Date, Week, Month, Year
   const now = DateTime.now();

   // -- Date
   expect(now.clone().nextDate().diff(now, 'date')).toEqual(1);
   expect(now.clone().prevDate().diff(now, 'date')).toEqual(-1);

   // -- Week
   expect(now.clone().nextWeek().diff(now, 'week')).toEqual(1);
   expect(now.clone().prevWeek().diff(now, 'week')).toEqual(-1);

   // -- Month
   expect(now.clone().nextMonth().native.getMonth()).toEqual(now.native.getMonth() + 1);
   expect(now.clone().prevMonth().native.getMonth()).toEqual(now.native.getMonth() - 1);

   // -- Year
   expect(now.clone().nextYear().native.getFullYear()).toEqual(now.native.getFullYear() + 1);
   expect(now.clone().prevYear().native.getFullYear()).toEqual(now.native.getFullYear() - 1);

   // -- Days In Months
   expect(DateTime.daysInMonth(2, 2024)).toEqual(29);
   expect(DateTime.daysInMonth(3, 2024)).toEqual(31);
   expect(DateTime.from('2024-02-01', '+07:00').daysInMonth()).toEqual(29);
});
