'use strict';
export class Str extends String {
   get text(): string {
      return this.toString();
   }

   static uFirst(str: string): string {
      return str.length > 1 ? `${str[0].toUpperCase()}${str.substring(1)}` : str;
   }

   static lFirst(str: string): string {
      return str.length > 1 ? `${str[0].toLowerCase()}${str.substring(1)}` : str;
   }

   static toCapitalize(str: string, ignoreNoneWord = false): string {
      const words = str.split(/\b/).map(Str.uFirst);

      if (ignoreNoneWord) {
         return words.filter((word) => !!word.trim() && !/\W/.test(word)).join('');
      }

      return words.join('');
   }

   static toCamelCase(str: string): string {
      return Str.lFirst(Str.toCapitalize(str, true));
   }

   static camelToSnackCase(str: string): string {
      const output: string[] = [];

      for (let i = 0, n = str.length; i < n; i++) {
         const char = str[i];
         output.push(char === char.toUpperCase() ? `_${char}` : char);
      }

      return output.join('').toLowerCase();
   }

   static snackToCamelCase(str: string): string {
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

   static truncate(str: string, options?: { maxLength?: number; wordCount?: boolean; pad?: string }): string {
      const pad = options.pad || '...';
      const len = options.maxLength || 50;
      str = str.trim();

      if (options.wordCount === true) {
         const strs = str.split(/\s+/);
         const orgLen = strs.length;
         const copy = strs.slice(0, len);
         str = copy.join(' ');

         if (orgLen > copy.length) {
            str += pad;
         }
      } else {
         const orgLen = str.length;
         str = str.substring(0, len);

         if (orgLen > str.length) {
            str += pad;
         }
      }

      return str;
   }

   static from(strLike: any): Str {
      return new Str(strLike);
   }

   static repeat(char: string, level = 0): string {
      let output = char;
      level = parseInt(level.toString());

      if (level <= 0) {
         return '';
      }

      while (--level > 0) {
         output = `${output}${char}`;
      }

      return output;
   }

   uFirst(): string {
      return Str.uFirst(this.text);
   }

   lFirst(): string {
      return Str.lFirst(this.text);
   }

   toCapitalize(ignoreNoneWord = false): string {
      return Str.toCapitalize(this.text, ignoreNoneWord);
   }

   toCamelCase(): string {
      return Str.toCamelCase(this.text);
   }

   camelToSnackCase(): string {
      return Str.camelToSnackCase(this.text);
   }

   snackToCamelCase(): string {
      return Str.snackToCamelCase(this.text);
   }

   truncate(options?: { maxLength?: number; wordCount?: boolean; pad?: string }): string {
      return Str.truncate(this.text, options);
   }
}
