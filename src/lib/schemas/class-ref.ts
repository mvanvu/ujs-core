import { ClassConstructor } from '../../type';
import { Is } from '../is';
import { Util } from '../util';
import { ArraySchema } from './array';
import { BaseSchema } from './base';
import { UJS_CLASS_PROPERTIES, UJS_SWAGGER_PROPERTIES_ARRAY, UJS_SWAGGER_PROPERTIES_MODEL } from './constant';
import { ObjectSchema, ObjectSchemaProps } from './object';
import 'reflect-metadata';
export class ClassRefSchema<T extends object> extends ObjectSchema<T> {
   constructor(private readonly classRef: ClassConstructor<T>) {
      super(ClassRefSchema.collectAllProperties(classRef).schemaProps);
   }

   static collectAllProperties<T extends object>(classRef: ClassConstructor<T>): { schemaProps: ObjectSchemaProps<T>; swaggerProps: Record<string, any> } {
      const swaggerProps: Record<string, any> = {};
      const schemaProps = Util.clone(Reflect.getMetadata(UJS_CLASS_PROPERTIES, classRef.prototype) || {});
      const collectSwaggerProperties = (target: Object) => {
         Util.clone(Reflect.getMetadata(UJS_SWAGGER_PROPERTIES_ARRAY, target) || []).forEach((prop: string) => {
            // Remove first char :
            prop = prop.substring(1);

            if (!swaggerProps[prop]) {
               const swaggerProperty = Reflect.getMetadata(UJS_SWAGGER_PROPERTIES_MODEL, target, prop);

               if (swaggerProperty) {
                  swaggerProps[prop] = Util.clone(swaggerProperty);
               }
            }
         });
      };

      let parentClass = classRef;

      while (parentClass) {
         if ((Is.object(parentClass) || Is.func(parentClass)) && Is.object(parentClass.prototype)) {
            collectSwaggerProperties(parentClass.prototype);
            const parentProps = Reflect.getMetadata(UJS_CLASS_PROPERTIES, parentClass.prototype);

            if (Is.object(parentProps)) {
               for (const key in parentProps) {
                  if (!schemaProps[key]) {
                     schemaProps[key] = Util.clone(parentProps[key]);
                  }
               }
            }
         }

         parentClass = Object.getPrototypeOf(parentClass);
      }

      return { schemaProps, swaggerProps };
   }

   static Pick<T extends object, K extends keyof T>(classRef: ClassConstructor<T>, properties: K[]): ClassConstructor<Pick<T, (typeof properties)[number]>> {
      const pickedSchemaProps = {};
      const pickedSwaggerProps = {};
      const { schemaProps, swaggerProps } = ClassRefSchema.collectAllProperties(classRef);

      class UjsClassRefPickType {}
      Reflect.defineProperty(UjsClassRefPickType, 'name', { value: 'UjsPickType' });
      Object.entries(schemaProps).forEach(([k, v]) => {
         if (properties.includes(k as any)) {
            pickedSchemaProps[k] = v;

            if (swaggerProps[k]) {
               pickedSwaggerProps[k] = swaggerProps[k];
               Reflect.defineMetadata(UJS_SWAGGER_PROPERTIES_MODEL, swaggerProps[k], UjsClassRefPickType.prototype, k);
            }
         }
      });
      Reflect.defineMetadata(UJS_CLASS_PROPERTIES, pickedSchemaProps, UjsClassRefPickType.prototype);
      Reflect.defineMetadata(
         UJS_SWAGGER_PROPERTIES_ARRAY,
         Object.keys(pickedSwaggerProps).map((p) => `:${p}`),
         UjsClassRefPickType.prototype,
      );

      return UjsClassRefPickType as ClassConstructor<Pick<T, (typeof properties)[number]>>;
   }

   static Omit<T extends object, K extends keyof T>(classRef: ClassConstructor<T>, properties: K[]): ClassConstructor<Omit<T, (typeof properties)[number]>> {
      const omitSchemaProps = {};
      const omitSwaggerProps = {};
      const { schemaProps, swaggerProps } = ClassRefSchema.collectAllProperties(classRef);
      class UjsClassRefOmitType {}
      Reflect.defineProperty(UjsClassRefOmitType, 'name', { value: 'UjsClassRefOmitType' });
      Object.entries(schemaProps).forEach(([k, v]) => {
         if (!properties.includes(k as any)) {
            omitSchemaProps[k] = v;

            if (swaggerProps[k]) {
               omitSwaggerProps[k] = swaggerProps[k];
               Reflect.defineMetadata(UJS_SWAGGER_PROPERTIES_MODEL, swaggerProps[k], UjsClassRefOmitType.prototype, k);
            }
         }
      });
      Reflect.defineMetadata(UJS_CLASS_PROPERTIES, omitSchemaProps, UjsClassRefOmitType.prototype);
      Reflect.defineMetadata(
         UJS_SWAGGER_PROPERTIES_ARRAY,
         Object.keys(omitSwaggerProps).map((p) => `:${p}`),
         UjsClassRefOmitType.prototype,
      );

      return UjsClassRefOmitType as ClassConstructor<Omit<T, (typeof properties)[number]>>;
   }

   static Partial<T extends object>(classRef: ClassConstructor<T>): ClassConstructor<Partial<T>> {
      const partialSchemaProps = {};
      const partialSwaggerProps = {};
      const { schemaProps, swaggerProps } = ClassRefSchema.collectAllProperties(classRef);

      class UjsClassRefPartialType {}
      Reflect.defineProperty(UjsClassRefPartialType, 'name', { value: 'UjsClassRefPartialType' });
      Object.entries(schemaProps).forEach(([k, v]) => {
         partialSchemaProps[k] = (v as BaseSchema).optional();

         if (swaggerProps[k]) {
            partialSwaggerProps[k] = swaggerProps[k];
            Reflect.defineMetadata(UJS_SWAGGER_PROPERTIES_MODEL, { ...swaggerProps[k], required: false }, UjsClassRefPartialType.prototype, k);
         }
      });

      Reflect.defineMetadata(UJS_CLASS_PROPERTIES, partialSchemaProps, UjsClassRefPartialType.prototype);
      Reflect.defineMetadata(
         UJS_SWAGGER_PROPERTIES_ARRAY,
         Object.keys(partialSwaggerProps).map((p) => `:${p}`),
         UjsClassRefPartialType.prototype,
      );

      return UjsClassRefPartialType;
   }

   array(): ArraySchema<this> {
      return new ArraySchema(this);
   }

   clone(): ClassRefSchema<T> {
      return new ClassRefSchema(this.classRef).setOptions(Util.clone(this.options));
   }
}
