import { IsArrayOptions } from '../../type';
import { Is } from '../is';
import { Util } from '../util';
import { BaseSchema } from './base';
import { schemaErrors } from './constant';
import { type ObjectSchema } from './object';

export type ItemSchema = BaseSchema | ObjectSchema<any> | ArraySchema<any>;

export class ArraySchema<T extends ItemSchema | ItemSchema[]> extends BaseSchema {
   protected options: IsArrayOptions = {};

   constructor(protected itemsProps?: T) {
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

   unique(unique?: boolean): this {
      this.options.unique = unique === undefined || unique === true;

      return this;
   }

   protected checkError(input: { value: any }, path: string): void {
      const { value } = input;

      if (!Is.array(value)) {
         this.appendError(path, { message: schemaErrors.NOT_AN_ARRAY });
      } else {
         if (this.options.unique && !Is.arrayUnique(value)) {
            this.appendError(path, { message: schemaErrors.NOT_AN_UNIQUE_ARRAY });
         }

         if (Is.number(this.options.minLength) && value.length < this.options.minLength) {
            this.appendError(path, { message: schemaErrors.ARRAY_MIN_LENGTH, meta: { minLength: this.options.minLength } });
         }

         if (Is.number(this.options.maxLength) && value.length > this.options.maxLength) {
            this.appendError(path, { message: schemaErrors.ARRAY_MAX_LENGTH, meta: { maxLength: this.options.maxLength } });
         }

         if (this.itemsProps) {
            if (Is.array(this.itemsProps)) {
               if (this.itemsProps.length !== this.itemsProps.length) {
                  this.appendError(path, schemaErrors.NOT_SUITABLE_ARRAY);
               } else {
                  for (let i = 0, n = this.itemsProps.length; i < n; i++) {
                     if (!this.itemsProps[i].check(value[i])) {
                        this.appendError(`${path}[${i}]`, this.itemsProps[i].getErrors());
                     } else if (Is.primitive(value[i])) {
                        value[i] = this.itemsProps[i].getValue();
                     }
                  }
               }
            } else {
               for (let i = 0, n = value.length; i < n; i++) {
                  const element = value[i];

                  if (!this.itemsProps.check(element)) {
                     this.appendError(path, this.itemsProps.getErrors());
                  } else if (Is.primitive(value[i])) {
                     value[i] = this.itemsProps.getValue();
                  }
               }
            }
         }
      }
   }

   buildSchema() {
      const { itemsProps } = this;
      const arraySchema = {
         type: this.isNullable() ? ['null', 'array'] : 'array',
         prefixItems: [],
         items: {},
         description: this.options,
         example: this.options.example,
      };

      if (itemsProps) {
         if (Is.array(itemsProps)) {
            for (let i = 0, n = itemsProps.length; i < n; i++) {
               arraySchema.prefixItems[i] = itemsProps[i].buildSchema();
            }
         } else {
            arraySchema.items = itemsProps.buildSchema();
         }
      }

      if (Is.empty(arraySchema.prefixItems)) {
         delete arraySchema.prefixItems;
      }

      if (Is.empty(arraySchema.items)) {
         delete arraySchema.items;
      }

      return arraySchema;
   }

   buildSwagger(): Record<string, any> {
      const arraySwagger: Record<string, any> = {
         type: Array,
         required: !this.isOptional(),
         description: this.options.description,
         example: this.options.example,
      };

      if (Is.array(this.itemsProps) && this.itemsProps[0] instanceof BaseSchema) {
         Object.assign(arraySwagger, { type: this.itemsProps[0].buildSwagger().type, isArray: true });
      }

      if (this.itemsProps instanceof BaseSchema) {
         Object.assign(arraySwagger, { type: this.itemsProps.buildSwagger().type, isArray: true });
      }

      return arraySwagger;
   }

   clone(): ArraySchema<T> {
      return new ArraySchema<T>(Util.clone(this.itemsProps)).setOptions(Util.clone(this.options));
   }
}
