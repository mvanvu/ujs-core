export type CommonType =
   | 'string'
   | 'number'
   | 'snumber'
   | 'unumber'
   | 'int'
   | 'sint'
   | 'uint'
   | 'bigint'
   | 'sbigint'
   | 'ubigint'
   | 'object'
   | 'array'
   | 'boolean'
   | 'undefined'
   | 'symbol'
   | 'function'
   | 'null'
   | 'regex'
   | 'set'
   | 'map'
   | 'NaN'
   | 'datestring'
   | 'date'
   | 'datetime';

export interface ObjectCommonType {
   [key: string]: CommonType | ObjectCommonType;
}
