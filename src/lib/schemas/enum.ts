import { EnumArgs, EnumElement } from '../../type';
import { Is } from '../is';
import { ArraySchema } from './array';
import { BaseSchema } from './base';
import { schemaErrors } from './constant';

export class EnumSchema extends BaseSchema {
   constructor(private data?: EnumArgs) {
      super();
   }

   get elements(): EnumElement[] {
      if (Is.array(this.data)) {
         return this.data;
      }

      if (Is.object(this.data)) {
         return Object.values(this.data);
      }

      return [];
   }

   protected checkError(input: { value: any }): void {
      if (!this.elements.includes(input.value)) {
         this.errors.push({ message: schemaErrors.NOT_AN_ENUM, meta: { enum: this.elements } });
      }
   }

   buildSchema() {
      const enumSchema = { type: ['string', 'number', 'integer', 'boolean'], enum: this.elements ?? [] };

      if (this.isAllowNull) {
         enumSchema.type.push('null');
      }

      return enumSchema;
   }

   array(): ArraySchema<this> {
      return new ArraySchema(this);
   }
}
