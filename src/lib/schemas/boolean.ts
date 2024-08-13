import { IsBaseOptions } from '../../type';
import { Is } from '../is';
import { ArraySchema } from './array';
import { BaseSchema } from './base';
import { schemaErrors } from './constant';

export class BooleanSchema extends BaseSchema {
   constructor(protected options: IsBaseOptions = {}) {
      super();
   }

   buildSchema() {
      return {
         type: this.isAllowNull ? ['null', 'boolean'] : 'boolean',
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
}
