import { ClassConstructor } from '../../type';
import { Is } from '../is';
import { BaseSchema } from './base';
import { UJS_CLASS_PROPERTIES } from './constant';
import { ObjectSchema, ObjectSchemaProps } from './object';

export class ClassRefSchema<T extends object> extends ObjectSchema<T> {
   constructor(private readonly classRef: ClassConstructor<T>) {
      super(ClassRefSchema.collectAllProperties(classRef));
   }

   static collectAllProperties<T extends object>(ClassRef: ClassConstructor<T>): ObjectSchemaProps<T> {
      const props = {} as ObjectSchemaProps<T>;
      let parentClass = ClassRef;

      while (parentClass) {
         if (Is.object(parentClass.prototype?.[UJS_CLASS_PROPERTIES])) {
            const properties = parentClass.prototype[UJS_CLASS_PROPERTIES];

            for (const key in properties) {
               if (!props[key] && properties[key] instanceof BaseSchema) {
                  props[key] = properties[key];
               }
            }
         }

         parentClass = Object.getPrototypeOf(parentClass);
      }

      return props;
   }

   public clone(): ClassRefSchema<T> {
      return new ClassRefSchema(this.classRef);
   }
}
