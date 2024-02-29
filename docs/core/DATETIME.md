## DATETIME

### Usage

```javascript
import { DateTime } from '@maivubc/ujs';
```

### DateTime Instance

```javascript
const date = new Date();
const datetime = DateTime.from(date);

// The datetime.native is an alt of JS native Date
datetime.native; // It returns: date
```

### Comparison

```javascript
// Equals
const dt = DateTime.from('2024-02-28');

// The parameter of the target is in type: number | string | Date | DateTime
dt.eq('2024-02-28'); // It returns: true

// Less than
dt.lt('2024-02-29'); // It returns: true

// Less than or equals
dt.lte('2024-02-28'); // It returns: true

// Greater than
dt.gt('2024-02-27'); // It returns: true

// Greater than or equals
dt.gte('2024-02-28'); // It returns: true
```

### Start/End Of

```javascript
// startOf(): move to the start of date
DateTime.from('2024-02-28 13:00:00').startOf().format('YYYY-MM-DD HH:mm:ss'); // It returns: '2024-02-28 00:00:00'
DateTime.now().startOf().eq(DateTime.yesterday().addDate(1).startOf()); // It returns: true

// endOf(): move to the end of date
DateTime.from('2024-02-28 13:00:00').endOf().format('YYYY-MM-DD HH:mm:ss'); // It returns: '2024-02-28 23:59:59'
DateTime.now().endOf().eq(DateTime.yesterday().addDate(1).endOf()); // It returns: true
```

### Clone

```javascript
const clone = datetime.clone();
clone.addDate(1);
clone.gt(date); // It returns: true
datetime.eq(date); // It returns: true
```

### TimeZone

```javascript
// Create the UTC now
const utc = DateTime.utc();
utc.format('Z'); // It returns: '+00:00'

// Clone to another UTC and convert to +07:00
const gmt7 = utc.clone().setOffset('+07:00');
gmt7.format('Z'); // It returns: '+07:00'

// Compare to date
utc.diff(gmt7, 'hour'); // It returns: -7
gmt7.diff(utc, 'hour'); // It returns: 7

// Compare by unix miliseconds
utc.valueOf() - gmt7.valueOf(); // It returns: -7 * 60 * 60 * 1000
```

### Format

```javascript
/**
Year
   YY: 70 71 … 29 30
   YYYY: 1970 1971 … 2029 2030
Month
   M: 1 2 … 11 12
   MM: 01 02 … 11 12
   MMM: Jan Feb … Nov Dec
   MMMM: January February … November December
Day of Month
   D: 1 2 … 30 31
   DD: 01 02 … 30 31
Day of Week
   ddd: Sun Mon … Fri Sat
   dddd: Sunday Monday … Friday Saturday
Hour
   H: 0 1 … 22 23
   HH: 00 01 … 22 23
   hh: 01 02 … 11 12
   h: 0 … 11 12
Minute
   m: 0 1 … 58 59
   mm: 00 01 … 58 59
Second
   s: 0 1 … 58 59
   ss: 00 01 … 58 59
Milisecond
   SS: 00 01 … 98 99
   SSS: 000 001 … 998 999
AM/PM
   A: AM, PM
   a: am, pm
Timezone offset
   Z: -07:00 -06:00 … +06:00 +07:00
Unix Timestamp
   x: 1360013296
*/
const nowUtc = DateTime.from('2024-02-29').utc();
nowUtc.format('YYYY-MM-DD HH:mm:ss:Z'); // It returns: '2024-02-29 00:00:00:+00:00'
nowUtc.format('YYYY-MM-DD H:m:s:Z'); // It returns: '2024-02-29 0:0:0:+00:00'

// Hour
nowUtc.format('YYYY-MM-DD HH:mm A'); // It returns: '2024-02-29 00:00 AM'
nowUtc.addHour(13);

nowUtc.format('YYYY-MM-DD HH:mm:ss'); // It returns: '2024-02-29 13:00:00'
nowUtc.format('YYYY-MM-DD HH:mm A'); // It returns: '2024-02-29 13:00 PM'
nowUtc.format('YYYY-MM-DD hh:mm:ss'); // It returns: '2024-02-29 01:00:00'
nowUtc.format('YYYY-MM-DD hh:mm a'); // It returns: '2024-02-29 01:00 pm'
```

### Diff by: 'week' | 'date' | 'hour' | 'minute' | 'second' | 'millisecond'

```javascript
// const dt = DateTime.from('2024-02-28');
dt.diff('2024-02-30', 'date'); // It returns: -2
dt.diff('2024-02-27', 'date'); // It returns: 1
dt.diff('2024-02-27', 'week'); // It returns: 0
```

### Walking

```javascript
const now = DateTime.now();

// Date
DateTime.now().nextDate().diff(now, 'date'); // It returns: 1
DateTime.now().prevDate().diff(now, 'date'); // It returns: -1

// Week
DateTime.now().nextWeek().diff(now, 'week'); // It returns: 1
DateTime.now().prevWeek().diff(now, 'week'); // It returns: -1

// Month
DateTime.now().nextMonth().native.getMonth(); // It returns: now.native.getMonth() + 1
DateTime.now().prevMonth().native.getMonth(); // It returns: now.native.getMonth() - 1

// Year
DateTime.now().nextYear().native.getFullYear(); // It returns: now.native.getFullYear() + 1
DateTime.now().prevYear().native.getFullYear(); // It returns: now.native.getFullYear() - 1
```

### Days In Months

```javascript
DateTime.daysInMonth(2, 2024); // It returns: 29
DateTime.daysInMonth(3, 2024); // It returns: 31
DateTime.from('2024-02-01', '+07:00').daysInMonth(); // It returns: 29
```

### Add

```javascript
// Year
DateTime.from('2024-02-28 13:00:00').addYear(1).format('YYYY'); // It returns: '2025'
DateTime.from('2024-02-28 13:00:00').addYear(-1).format('YYYY'); // It returns: '2023'

// Month
DateTime.from('2024-02-28 13:00:00').addMonth(1).format('MM'); // It returns: '03'
DateTime.from('2024-02-28 13:00:00').addMonth(-1).format('MM'); // It returns: '01'

// Date
DateTime.from('2024-02-28 13:00:00').addDate(1).format('DD'); // It returns: '29'
DateTime.from('2024-02-28 13:00:00').addDate(-1).format('DD'); // It returns: '27'

// Week
DateTime.from('2024-02-28 13:00:00').addWeek(1).format('MM-DD'); // It returns: '03-06'
DateTime.from('2024-02-28 13:00:00').addWeek(-1).format('MM-DD'); // It returns: '02-21'

// Hour
DateTime.from('2024-02-28 13:00:00').addHour(1).format('HH'); // It returns: '14'
DateTime.from('2024-02-28 13:00:00').addHour(-1).format('HH'); // It returns: '12'

// Minute
DateTime.from('2024-02-28 13:00:00').addMinute(30).format('HH:mm'); // It returns: '13:30'
DateTime.from('2024-02-28 13:00:00').addMinute(-30).format('HH:mm'); // It returns: '12:30'

// Second
DateTime.from('2024-02-28 13:00:00').addSecond(60).format('HH:mm:ss'); // It returns: '13:01:00'
DateTime.from('2024-02-28 13:00:00').addSecond(-90).format('HH:mm:ss'); // It returns: '12:58:30'

// Milisecond
DateTime.from('2024-02-28 13:00:00').addMillisecond(999).format('HH:mm:ss.SSS'); // It returns: '13:00:00.999'
DateTime.from('2024-02-28 13:00:00').addMillisecond(-999).format('HH:mm:ss.SSS'); // It returns: '12:59:59.001'
```

### DateTimeLike: number | string | Date | DateTime

```javascript
// Parse
DateTime.parse(Date.now()); // It returns: an instanceof Date
DateTime.parse(DateTime.now()); // It returns: an instanceof Date
DateTime.parse('2024-02-28 13:00:00'); // It returns: an instanceof Date
DateTime.parse('2024-02-28_13:00:00'); // It returns: false
DateTime.parse(''); // It returns: false
DateTime.parse(0); // It returns: false
```

### Other

```javascript
// ValueOf
dt.valueOf(); // It returns a number of time in miliseconds

// ISO
dt.iso; // It returns a ISO date time string like: YYYY-MM-DDTHH:mm:ss.sss

// Check if the date is valid
dt.valid; // It returns: true
```
