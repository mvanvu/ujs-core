import { EnumElement, IsBaseOptions, IsNumberOptions, IsStringOptions } from '../type';
import { ArraySchema, BooleanSchema, EnumSchema, ItemSchema, NumberSchema, ObjectSchema, ObjectSchemaProps, StringSchema } from './schemas';

export class Schema {
   static string(options?: IsStringOptions): StringSchema {
      return new StringSchema(options);
   }

   static number(options?: IsNumberOptions): NumberSchema {
      return new NumberSchema(options);
   }

   static boolean(options?: IsBaseOptions): BooleanSchema {
      return new BooleanSchema(options);
   }

   static enum(emum: EnumElement[]): EnumSchema {
      return new EnumSchema(emum);
   }

   static object<T extends object>(properties?: ObjectSchemaProps<T>): ObjectSchema<T> {
      return new ObjectSchema(properties);
   }

   static array<T extends ItemSchema | ItemSchema[]>(itemsProps?: T): ArraySchema<T> {
      return new ArraySchema(itemsProps);
   }
}
