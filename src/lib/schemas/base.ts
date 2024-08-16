import { ClassConstructor, IsBaseOptions } from '../../type';
import { Is } from '../is';
import { UJS_CLASS_PROPERTIES, UJS_SWAGGER_PROPERTIES_ARRAY, UJS_SWAGGER_PROPERTIES_MODEL } from './constant';
import 'reflect-metadata';

export abstract class BaseSchema {
   protected options: IsBaseOptions = {};

   protected errors: any = null;

   protected value: any = undefined;

   protected allowValues: any[];

   protected description: string;

   protected example: any;

   isNullable(): boolean {
      return this.options.nullable === true || (this.options.nullable === undefined && this.options.optional === true);
   }

   isOptional(): boolean {
      return this.options.optional === true;
   }

   setOptions(options: IsBaseOptions): this {
      this.options = options;

      return this;
   }

   getOptions(): IsBaseOptions {
      return this.options;
   }

   optional(optional?: boolean): this {
      this.options.optional = optional === undefined || optional === true;

      return this;
   }

   nullable(nullable?: boolean): this {
      this.options.nullable = nullable === undefined || nullable === true;

      return this;
   }

   allow(...values: any[]): this {
      this.allowValues = values;

      return this;
   }

   reset(): this {
      this.value = undefined;
      this.errors = [];

      return this;
   }

   getErrors(): any {
      return this.errors;
   }

   getValue(): any {
      return this.value;
   }

   check(value: any): boolean {
      this.reset();
      this.value = value;
      const optional = this.options.optional === true;
      const nullable = this.options.nullable === true || (this.options?.nullable === undefined && optional);

      if (
         (optional && value === undefined) ||
         (nullable && value === null) ||
         (Is.array(this.allowValues) && this.allowValues.findIndex((allowValue) => Is.equals(allowValue, value)) !== -1)
      ) {
         return true;
      }

      const input = { value };
      this.checkError(input, '');
      const isValid = Is.empty(this.errors);

      if (isValid && Is.primitive(value) && !Is.equals(value, input.value)) {
         // Update the primitive value
         this.value = input.value;
      }

      return isValid;
   }

   protected appendError(path: string, error: any): this {
      if (!Is.object(this.errors)) {
         this.errors = {};
      }

      const isLeafError = (e: any) => Is.array(e) && Is.object(e[0]) && Is.string(e[0].message);
      const setError = (p: string, e: any[]) => {
         p = p
            .replace(/\$|^\.|\.$/g, '')
            .replace(/\.+/g, '.')
            .replace(/\.\[/g, '[');

         if (!Is.array(this.errors[p])) {
            this.errors[p] = [];
         }

         this.errors[p].push(...e);
      };
      const flatten = (p: string, err: any) => {
         if (isLeafError(err)) {
            setError(p, err);
         } else if (Is.array(err)) {
            err.forEach((e, i) => {
               const p2 = `${p}[${i}]`;
               flatten(p2, e);
            });
         } else if (Is.object(err)) {
            if (Is.string(err.message)) {
               setError(p, [err]);
            } else {
               for (const k in err) {
                  const e = err[k];
                  const p2 = `${p}.${k}`;

                  if (isLeafError(e)) {
                     setError(p2, e);
                  } else if (Is.object(e)) {
                     flatten(p2, e);
                  }
               }
            }
         }
      };

      flatten(path, error);

      return this;
   }

   desc(description: string): this {
      this.description = description;

      return this;
   }

   eg(example: any): this {
      this.example = example;

      return this;
   }

   // Typesscript decorator for custom class
   decorate(): PropertyDecorator {
      const schema = this;

      return function (target: Object, propertyKey: PropertyKey): void {
         const properties = Reflect.getMetadata(UJS_CLASS_PROPERTIES, target) || {};
         properties[propertyKey] = schema;
         Reflect.defineMetadata(UJS_CLASS_PROPERTIES, properties, target);

         // Apply Swagger
         schema.defineSwaggerMetadata(target, propertyKey);
      };
   }

   defineSwaggerMetadata(target: Object, propertyKey: PropertyKey): this {
      const properties = (Reflect.getMetadata(UJS_SWAGGER_PROPERTIES_ARRAY, target) || []) as string[];
      const property = `:${propertyKey as string}`;

      if (!properties.includes(property)) {
         Reflect.defineMetadata(UJS_SWAGGER_PROPERTIES_ARRAY, [...properties, property], target);
      }

      Reflect.defineMetadata(UJS_SWAGGER_PROPERTIES_MODEL, this.buildSwagger(), target, propertyKey as string);

      return this;
   }

   protected abstract checkError(input: { value: any }, path: string | undefined): void;
   abstract buildSchema(): Record<string, any>;
   abstract buildSwagger(): Record<string, any>;
   abstract clone(): BaseSchema;
}
