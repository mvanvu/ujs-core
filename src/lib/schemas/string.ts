import { IsStringOptionFormat, IsStringOptions, IsStrongPasswordOptions } from '../../type';
import { Is } from '../is';
import { Transform } from '../transform';
import { Util } from '../util';
import { ArraySchema } from './array';
import { BaseSchema } from './base';
import { schemaErrors } from './constant';

export class StringSchema extends BaseSchema {
   constructor(protected options: IsStringOptions = {}) {
      super();
   }

   minLength(num: number): this {
      this.options.minLength = num;

      return this;
   }

   maxLength(num: number): this {
      this.options.maxLength = num;

      return this;
   }

   format(format: IsStringOptionFormat): this {
      this.options.format = format;

      return this;
   }

   strongPassword(options?: IsStrongPasswordOptions): this {
      this.options.strongPassword = options ?? {};

      return this;
   }

   allowHtml(allowHtml?: IsStringOptions['allowHtml']): this {
      this.options.allowHtml = allowHtml === undefined ? 'safe' : allowHtml;

      return this;
   }

   buildSchema() {
      return {
         type: this.isNullable() ? ['null', 'string'] : 'string',
         minLength: this.options.minLength,
         maxLength: this.options.maxLength,
         description: this.description,
         example: this.example,
         format:
            this.options.format === 'dateTime'
               ? 'date-time'
               : ['date', 'time', 'email', 'ipv4', 'ipv6', 'uri'].includes(this.options.format as string)
                 ? this.options.format
                 : undefined,
      };
   }

   buildSwagger(): Record<string, any> {
      return {
         type: String,
         required: !this.isOptional(),
         description: this.description,
         example: this.example,
      };
   }

   protected checkError(input: { value: any }): void {
      let { value } = input;

      if (Is.string(value)) {
         if (this.options.format && !Is.stringFormat(value, this.options.format)) {
            const format = this.options.format instanceof RegExp ? 'RegExp' : this.options.format;
            this.errors.push({ message: schemaErrors.INVALID_STRING_FORMAT, meta: { format } });
         }

         // Handle transform string value (only no-format && strongPassword options)
         if (this.options.allowHtml !== 'raw' && !this.options.format && !this.options.strongPassword) {
            switch (this.options.allowHtml) {
               case 'safe':
                  value = Transform.toSafeHtml(value).trim();
                  break;

               // Defaults to strip
               case undefined:
               case false:
               default:
                  value = Transform.toStripTags(value).trim();
                  break;
            }
         }

         if (this.options.strongPassword && !Is.strongPassword(value, this.options.strongPassword)) {
            this.errors.push({ message: schemaErrors.NOT_STRONG_PASSWORD, meta: { ...this.options.strongPassword } });
         }

         if (Is.number(this.options.minLength) && value.length < this.options.minLength) {
            this.errors.push({ message: schemaErrors.STRING_MIN_LENGTH, meta: { minLength: this.options.minLength } });
         }

         if (Is.number(this.options.maxLength) && value.length > this.options.maxLength) {
            this.errors.push({ message: schemaErrors.STRING_MAX_LENGTH, meta: { maxLength: this.options.maxLength } });
         }

         if (!this.errors.length) {
            // Handle transform string value
            switch (this.options.format) {
               case 'boolean':
                  value = Transform.toBoolean(value);
                  break;

               case 'number':
               case 'unsignedNumber':
               case 'integer':
               case 'unsignedInteger':
                  value = Transform.toNumber(value);
                  break;
            }

            input.value = value;
         }
      } else {
         this.errors.push({ message: schemaErrors.NOT_A_STRING });
      }
   }

   array(): ArraySchema<this> {
      return new ArraySchema(this);
   }

   clone(): StringSchema {
      return new StringSchema(Util.clone(this.options));
   }
}
