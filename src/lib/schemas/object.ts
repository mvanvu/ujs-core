import { Is } from '../is';
import { Util } from '../util';
import { ArraySchema, ItemSchema } from './array';
import { BaseSchema } from './base';
import { schemaErrors } from './constant';
import 'reflect-metadata';

export type ObjectSchemaProps<T extends object> = { [K in keyof T]: ItemSchema };
export class ObjectSchema<T extends object> extends BaseSchema {
   private isWhiteList = false;

   constructor(private properties?: ObjectSchemaProps<T>) {
      super();
   }

   getProperties(): ObjectSchemaProps<T> | undefined {
      return this.properties;
   }

   getPropertyKeys(): string[] {
      return this.properties ? Object.keys(this.properties) : [];
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
         this.appendError(path, { code: schemaErrors.NOT_AN_OBJECT });
      } else if (this.properties) {
         // Handle white list
         const propertyKeys = this.getPropertyKeys();

         for (const key in value) {
            if (!propertyKeys.includes(key)) {
               if (this.isWhiteList) {
                  delete value[key];
               } else {
                  this.appendError(`${path}.${key}`, { code: schemaErrors.NOT_ALLOW_PROPERTY });
               }
            }
         }

         for (const key of propertyKeys) {
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
      const required: string[] = [];
      const objSchema = {
         type: this.isNullable() ? ['null', 'object'] : 'object',
         required,
         properties: {},
         description: this.options.description,
      };

      if (this.properties) {
         for (const key in this.properties) {
            const schema = this.properties[key];

            if (!schema.isOptional) {
               required.push(key);
            }
         }

         if (this.properties) {
            Object.entries<ItemSchema>(this.properties).map(([k, v]) => (objSchema.properties[k] = v.buildSchema()));
         }
      }

      if (!required.length) {
         delete objSchema.required;
      }

      return objSchema;
   }

   buildSwagger(): Record<string, any> {
      const objSwagger: Record<string, any> = {
         type: 'object',
         required: !this.isOptional(),
         nullable: this.isNullable(),
         description: this.options.description,
         example: this.options.example,
      };

      return objSwagger;
   }

   array(): ArraySchema<this> {
      return new ArraySchema(this);
   }

   clone(): ObjectSchema<T> {
      const obj = new ObjectSchema(this.properties ? Util.clone(this.properties) : undefined).setOptions(this.options);

      if (this.isWhiteList) {
         obj.whiteList(true);
      }

      return obj;
   }
}
