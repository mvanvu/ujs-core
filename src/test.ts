import { ClassRefSchema } from './lib';
import { Schema } from './lib/schema';

export class FooSchema {
   @(Schema.uint(true).decorate())
   uint: number;

   @(Schema.email().decorate())
   email: string;
}

export class BarSchema {
   @(Schema.content().decorate())
   content: string;

   @(Schema.classRef(FooSchema).decorate())
   foo: FooSchema;
}
