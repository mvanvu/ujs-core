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
                  this.appendError(`${path}.${key}`, { message: schemaErrors.NOT_ALLOW_PROPERTY });
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
      const required: string[] = [];
      const objSchema = {
         type: this.isNullable() ? ['null', 'object'] : 'object',
         required,
         properties: {},
         description: this.description,
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
         type: Object,
         required: !this.isOptional(),
         description: this.description,
         example: this.example,
      };

      if (this.properties) {
         class SwaggerObject<T extends object> extends ObjectSchema<T> {}
         Reflect.defineProperty(SwaggerObject, 'name', { value: `SwaggerObject${Date.now()}` });

         for (const property in this.properties) {
            this.properties[property].defineSwaggerMetadata(SwaggerObject.prototype, property);
         }

         objSwagger.type = SwaggerObject;
      }

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
