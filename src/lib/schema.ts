import { ClassConstructor, EnumElement, IsBaseOptions, IsNumberOptions, IsStringOptions, IsStrongPasswordOptions } from '../type';
import { ArraySchema, BooleanSchema, ClassRefSchema, EnumSchema, ItemSchema, NumberSchema, ObjectSchema, ObjectSchemaProps, StringSchema } from './schemas';

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

   // Schema aliases
   static trim(): StringSchema {
      return Schema.string().format('trim');
   }

   static strNum(): StringSchema {
      return Schema.string().format('number');
   }

   static content(): StringSchema {
      return Schema.string().format('trim').minLength(1);
   }

   static strUNum(): StringSchema {
      return Schema.string().format('unsignedNumber');
   }

   static strInt(): StringSchema {
      return Schema.string().format('integer');
   }

   static strUInt(): StringSchema {
      return Schema.string().format('unsignedInteger');
   }

   static strBool(): StringSchema {
      return Schema.string().format('boolean');
   }

   static email(): StringSchema {
      return Schema.string().format('email');
   }

   static safeHTML(): StringSchema {
      return Schema.string().allowHtml('safe');
   }

   static raw(): StringSchema {
      return Schema.string().allowHtml('raw');
   }

   static password(options?: IsStrongPasswordOptions): StringSchema {
      return Schema.string().strongPassword(options);
   }

   static regex(regex: RegExp): StringSchema {
      return Schema.string().format(regex);
   }

   static ipv4(): StringSchema {
      return Schema.string().format('ipv4');
   }

   static mongoId(): StringSchema {
      return Schema.string().format('mongoId');
   }

   static dateTime(): StringSchema {
      return Schema.string().format('dateTime');
   }

   static date(): StringSchema {
      return Schema.string().format('date');
   }

   static time(): StringSchema {
      return Schema.string().format('time');
   }

   static jwt(): StringSchema {
      return Schema.string().format('jwt');
   }

   static uri(): StringSchema {
      return Schema.string().format('uri');
   }

   static imageUri(): StringSchema {
      return Schema.string().format('image');
   }

   static alphanum(): StringSchema {
      return Schema.string().format('alphanum');
   }

   static int(): NumberSchema {
      return Schema.number().integer();
   }

   static uint(nonZero?: boolean): NumberSchema {
      return Schema.number()
         .integer()
         .min(nonZero === true ? 1 : 0);
   }

   static unum(nonZero?: boolean): NumberSchema {
      return Schema.number().min(nonZero === false ? 1 : 0);
   }

   static classRef<T extends object>(classRef: ClassConstructor<T>): ClassRefSchema<T> {
      return new ClassRefSchema(classRef);
   }
}
