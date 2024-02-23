'use strict';
export class Str extends String {
   get text() {
      return this.toString();
   }

   static uFirst(str: string) {
      return str.length > 1 ? `${str[0].toUpperCase()}${str.substring(1)}` : str;
   }

   static lFirst(str: string) {
      return str.length > 1 ? `${str[0].toLowerCase()}${str.substring(1)}` : str;
   }

   static toCapitalize(str: string, ignoreNoneWord = false) {
      const words = str.split(/\b/).map(Str.uFirst);

      if (ignoreNoneWord) {
         return words.filter((word) => !!word.trim() && !/\W/.test(word)).join('');
      }

      return words.join('');
   }

   static toCamelCase(str: string) {
      return Str.lFirst(Str.toCapitalize(str, true));
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

   static truncate(str: string, maxLength = 50, pad?: string) {
      pad = pad || '...';
      str = str.trim();
      const len = str.length;
      str = str.substring(0, maxLength);

      if (len > str.length) {
         str += pad;
      }

      return str;
   }

   static from(strLike: any) {
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
      return Str.uFirst(this.text);
   }

   lFirst() {
      return Str.lFirst(this.text);
   }

   toCapitalize(ignoreNoneWord = false) {
      return Str.toCapitalize(this.text, ignoreNoneWord);
   }

   toCamelCase() {
      return Str.toCamelCase(this.text);
   }

   camelToSnackCase() {
      return Str.camelToSnackCase(this.text);
   }

   snackToCamelCase() {
      return Str.snackToCamelCase(this.text);
   }

   truncate(maxLength = 50, pad?: string) {
      return Str.truncate(this.text, maxLength, pad);
   }

   repeat(level = 0) {
      return Str.repeat(this.text, level);
   }
}
