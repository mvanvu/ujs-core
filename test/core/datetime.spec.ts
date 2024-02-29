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
   expect(clone.gt(date)).toBeTruthy();
   expect(datetime.eq(date)).toBeTruthy();

   // # TimeZone
   // ## Create the UTC now
   const utc = DateTime.utc();
   expect(utc.format('Z')).toEqual('+00:00');

   // ## Clone to another UTC and convert to +07:00
   const gmt7 = utc.clone().setOffset('+07:00');
   expect(gmt7.format('Z')).toEqual('+07:00');

   // ## Compare to date
   expect(utc.diff(gmt7, 'hour')).toEqual(-7);
   expect(gmt7.diff(utc, 'hour')).toEqual(7);

   // ## Compare by unix miliseconds
   expect(utc.valueOf() - gmt7.valueOf()).toEqual(-7 * 60 * 60 * 1000);

   // # Format
   /**
      Year	
         -- YY: 70 71 … 29 30
         -- YYYY: 1970 1971 … 2029 2030
      Month	
         -- M: 1 2 … 11 12
         -- MM: 01 02 … 11 12
         -- MMM: Jan Feb … Nov Dec
         -- MMMM: January February … November December
      Day of Month	
         -- D: 1 2 … 30 31
         -- DD: 01 02 … 30 31
      Day of Week	
         -- ddd: Sun Mon … Fri Sat
         -- dddd: Sunday Monday … Friday Saturday
      Hour	
         -- H: 0 1 … 22 23
         -- HH: 00 01 … 22 23
         -- hh: 01 02 … 11 12
         -- h: 0 … 11 12
      Minute	
         -- m: 0 1 … 58 59
         -- mm: 00 01 … 58 59
      Second	
         -- s: 0 1 … 58 59
         -- ss: 00 01 … 58 59
      Milisecond	
         -- SS: 00 01 … 98 99
         -- SSS: 000 001 … 998 999
      AM/PM	
         -- A: AM, PM
         -- a: am, pm
      Timezone offset	
         -- Z: -07:00 -06:00 … +06:00 +07:00
      Unix Timestamp	
         -- x: 1360013296
    */
   const nowUtc = DateTime.from('2024-02-29').utc();
   expect(nowUtc.format('YYYY-MM-DD HH:mm:ss:Z')).toEqual('2024-02-29 00:00:00:+00:00');
   expect(nowUtc.format('YYYY-MM-DD H:m:s:Z')).toEqual('2024-02-29 0:0:0:+00:00');

   // ## Hour
   expect(nowUtc.format('YYYY-MM-DD HH:mm A')).toEqual('2024-02-29 00:00 AM');
   nowUtc.addHour(13);

   expect(nowUtc.format('YYYY-MM-DD HH:mm:ss')).toEqual('2024-02-29 13:00:00');
   expect(nowUtc.format('YYYY-MM-DD HH:mm A')).toEqual('2024-02-29 13:00 PM');
   expect(nowUtc.format('YYYY-MM-DD hh:mm:ss')).toEqual('2024-02-29 01:00:00');
   expect(nowUtc.format('YYYY-MM-DD hh:mm a')).toEqual('2024-02-29 01:00 pm');

   // # Diff by: 'week' | 'date' | 'hour' | 'minute' | 'second' | 'millisecond'
   // ## const dt = DateTime.from('2024-02-28');
   expect(dt.diff('2024-02-30', 'date')).toEqual(-2);
   expect(dt.diff('2024-02-27', 'date')).toEqual(1);
   expect(dt.diff('2024-02-27', 'week')).toEqual(0);

   // # Walking
   const now = DateTime.now();

   // ## Date
   expect(DateTime.now().nextDate().diff(now, 'date')).toEqual(1);
   expect(DateTime.now().prevDate().diff(now, 'date')).toEqual(-1);

   // ## Week
   expect(DateTime.now().nextWeek().diff(now, 'week')).toEqual(1);
   expect(DateTime.now().prevWeek().diff(now, 'week')).toEqual(-1);

   // ## Month
   expect(DateTime.now().nextMonth().native.getMonth()).toEqual(now.native.getMonth() + 1);
   expect(DateTime.now().prevMonth().native.getMonth()).toEqual(now.native.getMonth() - 1);

   // ## Year
   expect(DateTime.now().nextYear().native.getFullYear()).toEqual(now.native.getFullYear() + 1);
   expect(DateTime.now().prevYear().native.getFullYear()).toEqual(now.native.getFullYear() - 1);

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
   expect(DateTime.from('2024-02-28 13:00:00').addMillisecond(999).format('HH:mm:ss.SSS')).toEqual('13:00:00.999');
   expect(DateTime.from('2024-02-28 13:00:00').addMillisecond(-999).format('HH:mm:ss.SSS')).toEqual('12:59:59.001');

   // # DateTimeLike: number | string | Date | DateTime
   // ## Parse
   expect(DateTime.parse(Date.now())).toBeInstanceOf(Date);
   expect(DateTime.parse(DateTime.now())).toBeInstanceOf(Date);
   expect(DateTime.parse('2024-02-28 13:00:00')).toBeInstanceOf(Date);
   expect(DateTime.parse('2024-02-28_13:00:00')).toBeFalsy();
   expect(DateTime.parse('')).toBeFalsy();
   expect(DateTime.parse(0)).toBeFalsy();

   // # Other
   // ## ValueOf
   dt.valueOf(); // It returns a number of time in miliseconds

   // ## ISO
   dt.iso; // It returns a ISO date time string like: YYYY-MM-DDTHH:mm:ss.sss

   // ## Check if the date is valid
   expect(dt.valid).toBeTruthy();
});
