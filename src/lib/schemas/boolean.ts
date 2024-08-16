import { IsBaseOptions } from '../../type';
import { Is } from '../is';
import { Util } from '../util';
import { ArraySchema } from './array';
import { BaseSchema } from './base';
import { schemaErrors } from './constant';

export class BooleanSchema extends BaseSchema {
   constructor(protected options: IsBaseOptions = {}) {
      super();
   }

   buildSchema() {
      return {
         type: this.isNullable() ? ['null', 'boolean'] : 'boolean',
         description: this.description,
         example: this.example,
      };
   }

   buildSwagger(): Record<string, any> {
      return {
         type: Boolean,
         required: !this.isOptional(),
         description: this.description,
         example: this.example,
      };
   }

   protected checkError(input: { value: any }): void {
      if (!Is.boolean(input.value)) {
         this.errors.push({ message: schemaErrors.NOT_A_BOOLEAN });
      }
   }

   array(): ArraySchema<this> {
      return new ArraySchema(this);
   }

   clone(): BooleanSchema {
      return new BooleanSchema(Util.clone(this.options));
   }
}
