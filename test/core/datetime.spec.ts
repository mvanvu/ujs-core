import { DateTime } from '../../src';

it('Util DateTime', () => {
   // # DateTime Instance
   const date = new Date();
   const datetime = DateTime.from(date);

   // ## The datetime.native is an alt of JS native Date
   expect(datetime.native).toEqual(date);

   // # Comparison
   // ## Equals
   const dt = DateTime.from('2024-02-28');

   // The parameter of the target is in type: number | string | Date | DateTime
   expect(dt.eq('2024-02-28')).toBeTruthy();

   // ## Less than
   expect(dt.lt('2024-02-29')).toBeTruthy();

   // ## Less than or equals
   expect(dt.lte('2024-02-28')).toBeTruthy();

   // ## Greater than
   expect(dt.gt('2024-02-27')).toBeTruthy();

   // ## Greater than or equals
   expect(dt.gte('2024-02-28')).toBeTruthy();

   // # Start/End Of
   // ## startOf(): move to the start of date
   expect(DateTime.from('2024-02-28 13:00:00').startOf().format('YYYY-MM-DD HH:mm:ss')).toEqual('2024-02-28 00:00:00');
   expect(DateTime.now().startOf().eq(DateTime.yesterday().addDate(1).startOf())).toBeTruthy();

   // ## endOf(): move to the end of date
   expect(DateTime.from('2024-02-28 13:00:00').endOf().format('YYYY-MM-DD HH:mm:ss')).toEqual('2024-02-28 23:59:59');
   expect(DateTime.now().endOf().eq(DateTime.yesterday().addDate(1).endOf())).toBeTruthy();

   // # Clone
   const clone = datetime.clone();
   clone.addDate(1);
   expect(clone.native.getDate() - 1 === date.getDate()).toBeTruthy();
   expect(datetime.native.getDate() - 1 < date.getDate()).toBeTruthy();
   expect(clone.gt(date)).toBeTruthy();
   expect(datetime.eq(date)).toBeTruthy();

   // # TimeZone
   dt.setOffset('+08:00');
   expect(dt.format('Z')).toEqual('+08:00');

   // ## UTC: Convert to UTC dt.utc()
   // ## Create a UTC now
   expect(DateTime.utc().format('Z')).toEqual('+00:00');

   // # Format
   // ## const dt = DateTime.from('2024-02-28');
   // ## dt.setOffset('+08:00');
   expect(dt.format('YYYY-MM-DD HH:mm:ss:Z')).toEqual('2024-02-28 08:00:00:+08:00');

   // # Diff by: 'week' | 'date' | 'hour' | 'minute' | 'second' | 'millisecond'
   expect(dt.diff('2024-02-30', 'date')).toEqual(-2);
   expect(dt.diff('2024-02-27', 'date')).toEqual(1);
   expect(dt.diff('2024-02-27', 'week')).toEqual(0);

   // # Walking
   const now = DateTime.now();

   // ## Date
   expect(now.clone().nextDate().diff(now, 'date')).toEqual(1);
   expect(now.clone().prevDate().diff(now, 'date')).toEqual(-1);

   // ## Week
   expect(now.clone().nextWeek().diff(now, 'week')).toEqual(1);
   expect(now.clone().prevWeek().diff(now, 'week')).toEqual(-1);

   // ## Month
   expect(now.clone().nextMonth().native.getMonth()).toEqual(now.native.getMonth() + 1);
   expect(now.clone().prevMonth().native.getMonth()).toEqual(now.native.getMonth() - 1);

   // ## Year
   expect(now.clone().nextYear().native.getFullYear()).toEqual(now.native.getFullYear() + 1);
   expect(now.clone().prevYear().native.getFullYear()).toEqual(now.native.getFullYear() - 1);

   // # Days In Months
   expect(DateTime.daysInMonth(2, 2024)).toEqual(29);
   expect(DateTime.daysInMonth(3, 2024)).toEqual(31);
   expect(DateTime.from('2024-02-01', '+07:00').daysInMonth()).toEqual(29);

   // # Add
   // ## Year
   expect(DateTime.from('2024-02-28 13:00:00').addYear(1).format('YYYY')).toEqual('2025');
   expect(DateTime.from('2024-02-28 13:00:00').addYear(-1).format('YYYY')).toEqual('2023');

   // ## Month
   expect(DateTime.from('2024-02-28 13:00:00').addMonth(1).format('MM')).toEqual('03');
   expect(DateTime.from('2024-02-28 13:00:00').addMonth(-1).format('MM')).toEqual('01');

   // ## Date
   expect(DateTime.from('2024-02-28 13:00:00').addDate(1).format('DD')).toEqual('29');
   expect(DateTime.from('2024-02-28 13:00:00').addDate(-1).format('DD')).toEqual('27');

   // ## Week
   expect(DateTime.from('2024-02-28 13:00:00').addWeek(1).format('MM-DD')).toEqual('03-06');
   expect(DateTime.from('2024-02-28 13:00:00').addWeek(-1).format('MM-DD')).toEqual('02-21');

   // ## Hour
   expect(DateTime.from('2024-02-28 13:00:00').addHour(1).format('HH')).toEqual('14');
   expect(DateTime.from('2024-02-28 13:00:00').addHour(-1).format('HH')).toEqual('12');

   // ## Minute
   expect(DateTime.from('2024-02-28 13:00:00').addMinute(30).format('HH:mm')).toEqual('13:30');
   expect(DateTime.from('2024-02-28 13:00:00').addMinute(-30).format('HH:mm')).toEqual('12:30');

   // ## Second
   expect(DateTime.from('2024-02-28 13:00:00').addSecond(60).format('HH:mm:ss')).toEqual('13:01:00');
   expect(DateTime.from('2024-02-28 13:00:00').addSecond(-90).format('HH:mm:ss')).toEqual('12:58:30');

   // ## Milisecond
   expect(DateTime.from('2024-02-28 13:00:00').addMillisecond(999).format('HH:mm:ss.sss')).toEqual('13:00:00.999');
   expect(DateTime.from('2024-02-28 13:00:00').addMillisecond(-999).format('HH:mm:ss.sss')).toEqual('12:59:59.001');

   // # Other
   // ## ValueOf
   dt.valueOf(); // It returns a number of time in miliseconds

   // ## ISO
   dt.iso; // It returns a ISO date time string like

   // ## Check if the date is valid
   expect(dt.valid).toBeTruthy();
});
