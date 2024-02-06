'use strict';
export type DateTimeLike = number | string | Date | DateTime;
export type DateTimeUnit = 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';
export class DateTime {
   private isValid: boolean;
   private offset: number;
   private date: Date;

   constructor(datetimeLike?: DateTimeLike, offset?: number | string) {
      const date = DateTime.parse(datetimeLike);
      this.isValid = !!date;

      if (date) {
         this.date = date;
         this.offset = this.date.getTimezoneOffset();

         if (offset !== undefined) {
            this.setOffset(DateTime.parseOffset(offset));
         }
      } else {
         this.date = new Date(''); // An invalid date object
      }
   }

   public get valid() {
      return this.isValid;
   }

   public get iso() {
      return this.date.toISOString();
   }

   public get native() {
      return this.date;
   }

   public get time() {
      return this.date.getTime();
   }

   public get tzOffset() {
      const hours = Math.floor(this.offset / 60);
      const minutes = Math.abs(this.offset) % 60;
      const prefix = hours <= 0 ? '+' : '-';

      return `${prefix}${String(Math.abs(hours)).padStart(2, '0')}:${String(Math.abs(minutes)).padStart(2, '0')}`;
   }

   static parseOffset(offset: number | string) {
      if (typeof offset === 'number') {
         return offset;
      }

      if (offset.match(/^[+-]?\d{2}:\d{2}$/)) {
         const [hours, minutes] = offset.split(':');
         let offsetNum = Number(minutes);

         if (['+', '-'].includes(hours[0])) {
            offsetNum += Number(hours.substring(1)) * 60;

            if (hours[0] === '-') {
               offsetNum = -offsetNum;
            }
         } else {
            offsetNum += Number(hours.substring(1)) * 60;
         }

         return -offsetNum;
      }

      throw new Error(`Invalid offset ${offset}, the offset format must be a number or the string like: +07:00`);
   }

   static create(datetimeLike?: DateTimeLike, offset?: number | string) {
      return new DateTime(datetimeLike, offset);
   }

   static now(offset?: number | string) {
      return DateTime.create('now', offset);
   }

   static utc() {
      return DateTime.now().utc();
   }

   static yesterday(offset?: number | string) {
      return DateTime.now(offset).sub(1, 'day').startOf();
   }

   static tomorrow(offset?: number | string) {
      return DateTime.now(offset).add(1, 'day').startOf();
   }

   static parse(datetimeLike?: DateTimeLike) {
      if (datetimeLike instanceof DateTime) {
         datetimeLike = datetimeLike.time;
      } else if (datetimeLike === 'now' || datetimeLike === undefined) {
         datetimeLike = Date.now();
      }

      if (!datetimeLike) {
         return false;
      }

      const date = new Date(datetimeLike);

      return Number.isNaN(date.getTime()) ? false : date;
   }

   setOffset(offset: number) {
      const offsetDifference = this.offset - offset;
      this.date.setTime(this.date.getTime() + offsetDifference * 60000);
      this.offset = offset;

      return this;
   }

   utc() {
      if (this.offset !== 0) {
         const utcTimeInMilliseconds = this.date.getTime() - -this.offset * 60000;
         this.date.setTime(utcTimeInMilliseconds);
         this.offset = 0;
      }

      return this;
   }

   getDate() {
      return this.date;
   }

   clone() {
      const dt = DateTime.create(this.time);
      dt.offset = this.offset;

      return dt;
   }

   intervalToMilliseconds(interval: number, unit: DateTimeUnit = 'millisecond') {
      switch (unit) {
         case 'millisecond':
            return interval;

         case 'second':
            return interval * 1000;

         case 'minute':
            return interval * 60 * 1000;

         case 'hour':
            return interval * 60 * 60 * 1000;

         case 'day':
            return interval * 60 * 60 * 24 * 1000;

         case 'week':
            return interval * 60 * 60 * 24 * 7 * 1000;
      }
   }

   add(interval: number, unit: DateTimeUnit = 'millisecond') {
      const time = this.time + this.intervalToMilliseconds(interval, unit);
      this.date.setTime(time);

      return this;
   }

   sub(interval: number, unit: DateTimeUnit = 'millisecond') {
      const time = this.time - this.intervalToMilliseconds(interval, unit);
      this.date.setTime(time);

      return this;
   }

   startOf() {
      this.date.setHours(0, 0, 0, 0);

      return this;
   }

   endOf() {
      this.date.setHours(23, 59, 59, 999);

      return this;
   }

   pad(value: number, number = 2) {
      return String(Math.abs(value)).padStart(number, '0');
   }

   format(pattern = 'YYYY-MM-DD HH:mm:ss Z', locale?: string) {
      const { date, pad, tzOffset } = this;
      let output = pattern.replace(/YYYY/g, date.getFullYear().toString());
      output = output.replace(/YY/g, date.getFullYear().toString().substring(2));
      output = output.replace(/MMMM/g, date.toLocaleString(locale, { month: 'long' }));
      output = output.replace(/MMM/g, date.toLocaleString(locale, { month: 'short' }));
      output = output.replace(/MM/g, pad(date.getMonth() + 1));
      output = output.replace(/DD/g, pad(date.getDate()));
      output = output.replace(/HH/g, pad(date.getHours()));
      output = output.replace(/mm/g, pad(date.getMinutes()));
      output = output.replace(/sss/g, pad(date.getMilliseconds()));
      output = output.replace(/ss/g, pad(date.getSeconds()));
      output = output.replace(/dddd/g, date.toLocaleString(locale, { weekday: 'long' }));
      output = output.replace(/ddd/g, date.toLocaleString(locale, { weekday: 'short' }));
      output = output.replace(/x/g, date.getTime().toString());
      output = output.replace(/Z/g, tzOffset);

      return output;
   }

   diff(datetime?: DateTimeLike, unit: DateTimeUnit = 'millisecond') {
      if (datetime instanceof DateTime) {
         datetime = datetime.clone();
      } else {
         datetime = DateTime.create(datetime);
      }

      const milliseconds = this.clone().time - datetime.time;
      switch (unit) {
         case 'millisecond':
            return milliseconds;

         case 'second':
            return milliseconds * 1000;

         case 'minute':
            return Math.round(milliseconds / 60000); // 60 * 1000

         case 'hour':
            return Math.round(milliseconds / 3600000); // 60 * 60 * 1000

         case 'day':
            return Math.round(milliseconds / 86400000); // 3600 * 24 * 1000

         case 'week':
            return Math.round(milliseconds / 604800000); // 86400 * 7 * 1000
      }
   }

   isGreater(datetime?: DateTimeLike, unit: DateTimeUnit = 'millisecond') {
      return this.diff(datetime, unit) > 0;
   }

   isLesser(datetime?: DateTimeLike, unit: DateTimeUnit = 'millisecond') {
      return this.diff(datetime, unit) < 0;
   }

   isEquals(datetime?: DateTimeLike, unit: DateTimeUnit = 'millisecond') {
      return this.diff(datetime, unit) === 0;
   }

   // Primitive methods: toString => `${DateTime.now()}`, valueOf => +DateTime.now()
   toString() {
      return this.iso;
   }

   valueOf() {
      return this.time;
   }

   // Array syntax: [...DateTime.now()]
   *[Symbol.iterator]() {
      yield this.date.getFullYear();
      yield this.date.getMonth();
      yield this.date.getDate();
      yield this.date.getHours();
      yield this.date.getMinutes();
      yield this.date.getSeconds();
      yield this.date.getMilliseconds();
   }
}
