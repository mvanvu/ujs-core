import { IsBaseOptions } from '../../type';
import { Is } from '../is';
import { Util } from '../util';
import { ArraySchema } from './array';
import { BaseSchema } from './base';
import { schemaErrors } from './constant';

export class BooleanSchema extends BaseSchema {
   buildSchema() {
      return {
         type: this.isNullable() ? ['null', 'boolean'] : 'boolean',
         description: this.options.description,
         example: this.options.example,
      };
   }

   buildSwagger(): Record<string, any> {
      return {
         type: 'boolean',
         required: !this.isOptional(),
         nullable: this.isNullable(),
         description: this.options.description,
         example: this.options.example,
      };
   }

   protected checkError(input: { value: any }): void {
      if (!Is.boolean(input.value)) {
         this.errors.push({ code: schemaErrors.NOT_A_BOOLEAN });
      }
   }

   array(): ArraySchema<this> {
      return new ArraySchema(this);
   }

   clone(): BooleanSchema {
      return new BooleanSchema().setOptions(Util.clone(this.options));
   }
}
