import { EnumElement } from '../../type';
import { BaseSchema } from './base';
import { schemaErrors } from './constant';

export class EnumSchema extends BaseSchema {
   constructor(private emum?: EnumElement[]) {
      super();
   }

   valid(enumArray: EnumElement[]): this {
      this.emum = enumArray;

      return this;
   }

   protected checkError(input: { value: any }): void {
      if (!this.emum?.includes(input.value)) {
         this.errors.push({ message: schemaErrors.NOT_AN_ENUM, meta: { enum: this.emum } });
      }
   }

   buildSchema() {
      const enumSchema = { type: ['string', 'number', 'integer', 'boolean'], enum: this.emum ?? [] };

      if (this.isAllowNull) {
         enumSchema.type.push('null');
      }

      return enumSchema;
   }
}
