'use strict';
export class Str extends String {
   static uFirst(str: string) {
      return str.length > 1 ? `${str[0].toUpperCase()}${str.substring(1)}` : str;
   }

   static lFirst(str: string) {
      return str.length > 1 ? `${str[0].toLowerCase()}${str.substring(1)}` : str;
   }

   static toCapitalize(str: string) {
      return str
         .split(/[^a-z0-9]/i)
         .map((word) => Str.uFirst(word))
         .filter((word) => !!word.trim())
         .join('');
   }

   static toCamelCase(str: string) {
      return Str.lFirst(Str.toCapitalize(str));
   }

   static camelToSnackCase(str: string) {
      const output: string[] = [];

      for (let i = 0, n = str.length; i < n; i++) {
         const char = str[i];
         output.push(char === char.toUpperCase() ? `_${char}` : char);
      }

      return output.join('').toLowerCase();
   }

   static snackToCamelCase(str: string) {
      const output: string[] = [];
      let upperNext = false;

      for (let i = 0, n = str.length; i < n; i++) {
         const char = str[i];

         if (char === '_') {
            upperNext = true;
            continue;
         }

         if (upperNext) {
            upperNext = false;
            output.push(char.toUpperCase());
         } else {
            output.push(char.toLowerCase());
         }
      }

      if (output[0]) {
         output[0] = output[0].toLowerCase();
      }

      return output.join('');
   }

   static truncate(str: string, maxLength = 50, pad = '...') {
      str = str.trim();
      const len = str.length;
      str = str.substring(0, maxLength);

      if (len > str.length) {
         str += pad;
      }

      return str;
   }

   static create(strLike: any) {
      return new Str(strLike);
   }

   static repeat(char: string, level = 0) {
      level = parseInt(level.toString());

      if (level <= 0) {
         return '';
      }

      while (--level > 0) {
         char += `${char}`;
      }

      return char;
   }

   uFirst() {
      return Str.uFirst(this.valueOf());
   }

   lFirst() {
      return Str.lFirst(this.valueOf());
   }

   toCamelCase() {
      return Str.toCamelCase(this.valueOf());
   }

   camelToSnackCase() {
      return Str.camelToSnackCase(this.valueOf());
   }

   snackToCamelCase() {
      return Str.snackToCamelCase(this.valueOf());
   }

   truncate(maxLength = 50, pad = '...') {
      return Str.truncate(this.valueOf(), maxLength, pad);
   }

   repeat(level = 0) {
      return Str.repeat(this.valueOf(), level);
   }
}
