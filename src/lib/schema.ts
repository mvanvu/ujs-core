import { EnumElement, IsArrayOptions, IsBaseOptions, IsNumberOptions, IsStringOptionFormat, IsStringOptions, IsStrongPasswordOptions } from '../type';
import { Is } from './is';
import { Registry } from './registry';
import { Transform } from './transform';

export const schemaErrors = {
   NOT_AN_ARRAY: 'NOT_AN_ARRAY',
   NOT_AN_OBJECT: 'NOT_AN_OBJECT',
   NOT_A_STRING: 'NOT_A_STRING',
   INVALID_STRING_FORMAT: 'INVALID_STRING_FORMAT',
   STRING_MIN_LENGTH: 'STRING_MIN_LENGTH',
   STRING_MAX_LENGTH: 'STRING_MAX_LENGTH',
   ARRAY_MIN_LENGTH: 'ARRAY_MIN_LENGTH',
   ARRAY_MAX_LENGTH: 'ARRAY_MAX_LENGTH',
   NOT_A_NUMBER: 'NOT_A_NUMBER',
   NOT_AN_INTEGER: 'NOT_AN_INTEGER',
   NUMBER_MINIMUM: 'NUMBER_MINIMUM',
   NUMBER_MAXIMUM: 'NUMBER_MAXIMUM',
   NOT_A_BOOLEAN: 'NOT_A_BOOLEAN',
   NOT_AN_ENUM: 'NOT_AN_ENUM',
   REQUIRED: 'REQUIRED',
   NOT_ALLOW_NULL: 'NOT_ALLOW_NULL',
   NOT_ALLOW_PROPERTIES: 'NOT_ALLOW_PROPERTIES',
   NOT_SUITABLE_ARRAY: 'NOT_SUITABLE_ARRAY',
   NOT_AN_UNIQUE_ARRAY: 'NOT_AN_UNIQUE_ARRAY',
   NOT_STRONG_PASSWORD: 'NOT_STRONG_PASSWORD',
};
export abstract class BaseSchema {
   protected options: IsBaseOptions = {};

   protected errors: any = null;

   protected value: any = undefined;

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

      if ((optional && value === undefined) || (nullable && value === null)) {
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

   protected abstract checkError(input: { value: any }, path: string | undefined): void;
   public abstract buildSchema(): Record<string, any>;
}

export class StringSchema extends BaseSchema {
   constructor(protected options: IsStringOptions = {}) {
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

   format(format: IsStringOptionFormat): this {
      this.options.format = format;

      return this;
   }

   strongPassword(options?: IsStrongPasswordOptions): this {
      this.options.strongPassword = options ?? {};

      return this;
   }

   allowHtml(allowHtml?: IsStringOptions['allowHtml']): this {
      this.options.allowHtml = allowHtml === undefined ? 'safe' : allowHtml;

      return this;
   }

   buildSchema() {
      return {
         type: this.isAllowNull ? ['null', 'string'] : 'string',
         minLength: this.options.minLength,
         maxLength: this.options.maxLength,
         format:
            this.options.format === 'dateTime'
               ? 'date-time'
               : ['date', 'time', 'email', 'ipv4', 'ipv6', 'uri'].includes(this.options.format as string)
                 ? this.options.format
                 : undefined,
      };
   }

   protected checkError(input: { value: any }): void {
      let { value } = input;

      if (Is.string(value)) {
         if (this.options.format && !Is.stringFormat(value, this.options.format)) {
            const format = this.options.format instanceof RegExp ? 'RegExp' : this.options.format;
            this.errors.push({ message: schemaErrors.INVALID_STRING_FORMAT, meta: { format } });
         }

         // Handle transform string value (only no-format && strongPassword options)
         if (this.options.allowHtml !== 'raw' && !this.options.format && !this.options.strongPassword) {
            switch (this.options.allowHtml) {
               case 'safe':
                  value = Transform.toSafeHtml(value).trim();
                  break;

               // Defaults to strip
               case undefined:
               case false:
               default:
                  value = Transform.toStripTags(value).trim();
                  break;
            }
         }

         if (this.options.strongPassword && !Is.strongPassword(value, this.options.strongPassword)) {
            this.errors.push({ message: schemaErrors.NOT_STRONG_PASSWORD, meta: { ...this.options.strongPassword } });
         }

         if (Is.number(this.options.minLength) && value.length < this.options.minLength) {
            this.errors.push({ message: schemaErrors.STRING_MIN_LENGTH, meta: { minLength: this.options.minLength } });
         }

         if (Is.number(this.options.maxLength) && value.length > this.options.maxLength) {
            this.errors.push({ message: schemaErrors.STRING_MAX_LENGTH, meta: { maxLength: this.options.maxLength } });
         }

         if (!this.errors.length) {
            // Handle transform string value
            switch (this.options.format) {
               case 'boolean':
                  value = Transform.toBoolean(value);
                  break;

               case 'number':
               case 'unsignedNumber':
               case 'integer':
               case 'unsignedInteger':
                  value = Transform.toNumber(value);
                  break;
            }

            input.value = value;
         }
      } else {
         this.errors.push({ message: schemaErrors.NOT_A_STRING });
      }
   }
}

export class NumberSchema extends BaseSchema {
   constructor(protected options: IsNumberOptions = {}) {
      super();
   }

   integer(integer?: boolean): this {
      this.options.integer = integer === undefined || integer === true;

      return this;
   }

   min(min: number): this {
      this.options.min = min;

      return this;
   }

   max(max: number): this {
      this.options.max = max;

      return this;
   }

   buildSchema() {
      const type = this.options.integer === true ? 'integer' : 'number';

      return {
         type: this.isAllowNull ? ['null', type] : type,
         minimum: this.options.min,
         maximum: this.options.max,
      };
   }

   protected checkError(input: { value: any }): void {
      const { value } = input;

      if (Is.number(value)) {
         if (this.options.integer && !Number.isInteger(value)) {
            this.errors.push({ message: schemaErrors.NOT_AN_INTEGER });
         }

         if (Is.number(this.options.min) && value < this.options.min) {
            this.errors.push({ message: schemaErrors.NUMBER_MINIMUM, meta: { min: this.options.min } });
         }

         if (Is.number(this.options.max) && value > this.options.max) {
            this.errors.push({ message: schemaErrors.NUMBER_MAXIMUM, meta: { min: this.options.max } });
         }
      } else {
         this.errors.push({ message: this.options.integer ? schemaErrors.NOT_AN_INTEGER : schemaErrors.NOT_A_NUMBER });
      }
   }
}

export class BooleanSchema extends BaseSchema {
   constructor(protected options: IsBaseOptions = {}) {
      super();
   }

   buildSchema() {
      return { type: this.isAllowNull ? ['null', 'boolean'] : 'boolean' };
   }

   protected checkError(input: { value: any }): void {
      if (!Is.boolean(input.value)) {
         this.errors.push({ message: schemaErrors.NOT_A_BOOLEAN });
      }
   }
}

export type ItemSchema = NumberSchema | StringSchema | BooleanSchema | EnumSchema | ObjectSchema<any> | ArraySchema<any>;

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
      const objSchema = { type: this.isAllowNull ? ['null', 'object'] : 'object', required: this.keys, properties: {} };

      if (this.properties) {
         Object.entries<ItemSchema>(this.properties).map(([k, v]) => (objSchema.properties[k] = v.buildSchema()));
      }

      return objSchema;
   }
}

export class ArraySchema<T extends ItemSchema | ItemSchema[]> extends BaseSchema {
   private arrayUnique: boolean;

   constructor(
      private itemsProps?: T,
      protected options: IsArrayOptions = {},
   ) {
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
      this.arrayUnique = unique === undefined || unique === true;

      return this;
   }

   protected checkError(input: { value: any }, path: string): void {
      const { value } = input;

      if (!Is.array(value)) {
         this.appendError(path, { message: schemaErrors.NOT_AN_ARRAY });
      } else {
         if (this.arrayUnique && !Is.arrayUnique(value)) {
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
      const arraySchema = { type: this.isAllowNull ? ['null', 'array'] : 'array', prefixItems: [], items: {} };
      const { itemsProps } = this;

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
}

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
