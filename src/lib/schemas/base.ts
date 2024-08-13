import { IsBaseOptions } from '../../type';
import { Is } from '../is';
import { UJS_CLASS_PROPERTIES } from './constant';

export abstract class BaseSchema {
   protected options: IsBaseOptions = {};

   protected errors: any = null;

   protected value: any = undefined;

   protected allowValues: any[];

   get isAllowNull(): boolean {
      return this.options.nullable === true || (this.options.nullable === undefined && this.options.optional === true);
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

   // Typesscript decorator for custom class
   decorate(): PropertyDecorator {
      const schema = this;

      return function (target: Object, propertyKey: PropertyKey): void {
         if (!target.hasOwnProperty(UJS_CLASS_PROPERTIES)) {
            target[UJS_CLASS_PROPERTIES] = {};
         }

         if (!target[UJS_CLASS_PROPERTIES][propertyKey]) {
            target[UJS_CLASS_PROPERTIES][propertyKey] = {};
         }

         // Each property has only a schema
         target[UJS_CLASS_PROPERTIES][propertyKey] = schema;
      };
   }

   protected abstract checkError(input: { value: any }, path: string | undefined): void;
   public abstract buildSchema(): Record<string, any>;
}
