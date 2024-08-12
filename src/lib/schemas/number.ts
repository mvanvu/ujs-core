import { IsNumberOptions } from '../../type';
import { Is } from '../is';
import { ArraySchema } from './array';
import { BaseSchema } from './base';
import { schemaErrors } from './constant';

export class NumberSchema extends BaseSchema {
   constructor(protected options: IsNumberOptions = {}) {
      super();
   }

   integer(integer?: boolean): this {
      this.options.integer = integer === undefined || integer === true;

      return this;
   }

   min(min: number): this {
      this.options.min = min;

      return this;
   }

   max(max: number): this {
      this.options.max = max;

      return this;
   }

   buildSchema() {
      const type = this.options.integer === true ? 'integer' : 'number';

      return {
         type: this.isAllowNull ? ['null', type] : type,
         minimum: this.options.min,
         maximum: this.options.max,
      };
   }

   protected checkError(input: { value: any }): void {
      const { value } = input;

      if (Is.number(value)) {
         if (this.options.integer && !Number.isInteger(value)) {
            this.errors.push({ message: schemaErrors.NOT_AN_INTEGER });
         }

         if (Is.number(this.options.min) && value < this.options.min) {
            this.errors.push({ message: schemaErrors.NUMBER_MINIMUM, meta: { min: this.options.min } });
         }

         if (Is.number(this.options.max) && value > this.options.max) {
            this.errors.push({ message: schemaErrors.NUMBER_MAXIMUM, meta: { min: this.options.max } });
         }
      } else {
         this.errors.push({ message: this.options.integer ? schemaErrors.NOT_AN_INTEGER : schemaErrors.NOT_A_NUMBER });
      }
   }

   array(): ArraySchema<this> {
      return new ArraySchema(this);
   }
}
