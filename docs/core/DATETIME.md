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
clone.native.getDate() - 1 === date.getDate(); // It returns: true
datetime.native.getDate() - 1 < date.getDate(); // It returns: true
clone.gt(date); // It returns: true
datetime.eq(date); // It returns: true
```

### TimeZone

```javascript
dt.setOffset('+08:00');
dt.format('Z'); // It returns: '+08:00'

// UTC: Convert to UTC dt.utc()

// Create a UTC now
DateTime.utc().format('Z'); // It returns: '+00:00'
```

### Format

```javascript
// const dt = DateTime.from('2024-02-28');

// dt.setOffset('+08:00');
dt.format('YYYY-MM-DD HH:mm:ss:Z'); // It returns: '2024-02-28 08:00:00:+08:00'
```

### Diff by: 'week' | 'date' | 'hour' | 'minute' | 'second' | 'millisecond'

```javascript
dt.diff('2024-02-30', 'date'); // It returns: -2
dt.diff('2024-02-27', 'date'); // It returns: 1
dt.diff('2024-02-27', 'week'); // It returns: 0
```

### Walking

```javascript
const now = DateTime.now();

// Date
now.clone().nextDate().diff(now, 'date'); // It returns: 1
now.clone().prevDate().diff(now, 'date'); // It returns: -1

// Week
now.clone().nextWeek().diff(now, 'week'); // It returns: 1
now.clone().prevWeek().diff(now, 'week'); // It returns: -1

// Month
now.clone().nextMonth().native.getMonth(); // It returns: now.native.getMonth() + 1
now.clone().prevMonth().native.getMonth(); // It returns: now.native.getMonth() - 1

// Year
now.clone().nextYear().native.getFullYear(); // It returns: now.native.getFullYear() + 1
now.clone().prevYear().native.getFullYear(); // It returns: now.native.getFullYear() - 1
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
DateTime.from('2024-02-28 13:00:00').addMillisecond(999).format('HH:mm:ss.sss'); // It returns: '13:00:00.999'
DateTime.from('2024-02-28 13:00:00').addMillisecond(-999).format('HH:mm:ss.sss'); // It returns: '12:59:59.001'
```

### Other

```javascript
// ValueOf
dt.valueOf(); // It returns a number of time in miliseconds

// ISO
dt.iso; // It returns a ISO date time string like

// Check if the date is valid
dt.valid; // It returns: true
```
