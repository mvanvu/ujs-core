import { Is } from '../is';
import { ArraySchema, ItemSchema } from './array';
import { BaseSchema } from './base';
import { schemaErrors } from './constant';

export type ObjectSchemaProps<T extends object> = { [K in keyof T]: ItemSchema };
export class ObjectSchema<T extends object> extends BaseSchema {
   private isWhiteList = false;

   constructor(private properties?: ObjectSchemaProps<T>) {
      super();
   }

   get keys(): string[] {
      return Object.keys(this.properties);
   }

   whiteList(isWhiteList?: boolean): this {
      this.isWhiteList = isWhiteList === undefined || isWhiteList === true;

      return this;
   }

   resetErrors(): this {
      this.errors = {};

      return this;
   }

   protected checkError(input: { value: any }, path: string): void {
      const { value } = input;

      if (!Is.object(value)) {
         this.appendError(path, { message: schemaErrors.NOT_AN_OBJECT });
      } else if (this.properties) {
         // Handle white list
         for (const key in value) {
            if (!this.keys.includes(key)) {
               if (this.isWhiteList) {
                  delete value[key];
               } else {
                  this.appendError(`${path}.${key}`, { message: schemaErrors.NOT_ALLOW_PROPERTIES });
               }
            }
         }

         for (const key in this.properties) {
            const schema = this.properties[key];

            if (!schema.check(value[key])) {
               this.appendError(`${path}.${key}`, schema.getErrors());
            } else if (Is.primitive(value[key])) {
               value[key] = schema.getValue();
            }
         }
      }
   }

   buildSchema() {
      const objSchema = {
         type: this.isAllowNull ? ['null', 'object'] : 'object',
         required: this.keys,
         properties: {},
         description: this.description,
         example: this.example,
      };

      if (this.properties) {
         Object.entries<ItemSchema>(this.properties).map(([k, v]) => (objSchema.properties[k] = v.buildSchema()));
      }

      return objSchema;
   }

   array(): ArraySchema<this> {
      return new ArraySchema(this);
   }
}
