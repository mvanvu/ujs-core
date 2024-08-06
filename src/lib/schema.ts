import { EnumElement, IsBaseOptions, IsNumberOptions, IsStringOptionFormat, IsStringOptions, IsStrongPasswordOptions } from '../type';
import { Is } from './is';
export abstract class BaseSchema {
   protected options: IsBaseOptions = {};

   private readonly isType!: string;

   constructor() {
      this.isType = this.constructor.name.replace('Schema', '').toLowerCase();
   }

   get isAllowNull(): boolean {
      return this.options.nullable === true || (this.options.nullable === undefined && this.options.optional === true);
   }

   isArray(isArray?: boolean | 'unique'): this {
      this.options.isArray = isArray === 'unique' ? isArray : isArray === undefined || isArray === true;

      return this;
   }

   optional(optional?: boolean): this {
      this.options.optional = optional === undefined || optional === true;

      return this;
   }

   nullable(nullable?: boolean): this {
      this.options.nullable = nullable === undefined || nullable === true;

      return this;
   }

   check(value: any): boolean {
      switch (this.isType) {
         case 'number':
         case 'boolean':
         case 'string':
            return Is[this.isType].call(this, value, this.options);

         default:
            return false;
      }
   }

   abstract buildSchema(): Record<string, any>;
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

   strongPassword(options?: Omit<IsStrongPasswordOptions, 'isArray' | 'optional' | 'nullable'>): this {
      this.options.format = 'strongPassword';
      this.options.strongPassword = options ?? {};

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
               : ['date', 'time', 'email', 'ipV4', 'ipV6', 'url'].includes(this.options.format as string)
                 ? (this.options.format as string).toLowerCase().replace('url', 'uri')
                 : undefined,
      };
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
}

export class BooleanSchema extends BaseSchema {
   constructor(protected options: IsBaseOptions = {}) {
      super();
   }

   buildSchema() {
      return { type: this.isAllowNull ? ['null', 'boolean'] : 'boolean' };
   }
}

export type ItemSchema = NumberSchema | StringSchema | BooleanSchema | ObjectSchema<any> | ArraySchema<any>;

const handleWhiteList = (objSchema: ObjectSchema<any>, value: any, isWhiteList: boolean) => {
   if (!Is.object(value)) {
      throw new Error();
   }

   for (const k in value) {
      if (!objSchema.keys.includes(k)) {
         if (isWhiteList) {
            delete value[k];
            continue;
         }

         throw new Error();
      }
   }
};

const checkProperty = (properties: ItemSchema, value: any, isWhiteList?: boolean, path?: string) => {
   if (properties instanceof ObjectSchema) {
      if (isWhiteList === undefined) {
         isWhiteList = properties.isWhiteList;
      }

      handleWhiteList(properties, value, isWhiteList);
      properties.each((property, k) => checkProperty(property, value[k], isWhiteList));
   } else if (properties instanceof BaseSchema && !properties.check(value)) {
      throw new Error();
   }
};

export type ObjectSchemaProps<T extends object> = {
   [K in keyof T]: T[K] extends object ? ObjectSchemaProps<T[K]> : ItemSchema;
};

export class ObjectSchema<T extends object> extends BaseSchema {
   private _isWhiteList = false;

   constructor(private properties?: ObjectSchemaProps<T>) {
      super();
   }

   get isWhiteList(): boolean {
      return this._isWhiteList;
   }

   get keys(): string[] {
      return Object.keys(this.properties);
   }

   each(callback: (property: ItemSchema, k: string) => any): void {
      if (!Is.callable(callback) || Is.empty(this.properties)) {
         return;
      }

      for (const k in this.properties) {
         callback.call(this, this.properties[k], k);
      }
   }

   whiteList(isWhiteList?: boolean): this {
      this._isWhiteList = isWhiteList === undefined || isWhiteList === true;

      return this;
   }

   check(value: any): boolean {
      return Is.each(this.options, value, (item) => {
         try {
            handleWhiteList(this, item, this.isWhiteList);
            this.each((prop, k) => checkProperty(prop, item[k], this.isWhiteList, k));
         } catch (err) {
            return false;
         }

         return true;
      });
   }

   buildSchema() {
      const objSchema = { type: this.isAllowNull ? ['null', 'object'] : 'object', required: this.keys, properties: {} };

      this.each(function (property, key) {
         objSchema.properties[key] = property.buildSchema();
      });

      return objSchema;
   }
}

export class ArraySchema<T extends ItemSchema | ItemSchema[]> extends BaseSchema {
   constructor(private itemsProps?: T) {
      super();
   }

   check(value: any): boolean {
      return Is.each(this.options, value, (item) => {
         if (!Is.array(item)) {
            return false;
         }

         const { itemsProps } = this;

         if (itemsProps) {
            if (Is.array(itemsProps)) {
               if (itemsProps.length !== item.length) {
                  return false;
               }

               for (let i = 0, n = itemsProps.length; i < n; i++) {
                  if (!itemsProps[i].check(item[i])) {
                     return false;
                  }
               }
            } else {
               for (const element of item) {
                  if (!itemsProps.check(element)) {
                     return false;
                  }
               }
            }
         }

         return true;
      });
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

   check(value: any): boolean {
      return Is.each(this.options, value, (item) => !!this.emum?.includes(item));
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
