import { Path, NestedPick, NestedOmit, ExtendsObject, ExtendsObjects, DefaultObject, ObjectRecord } from '../type';
export declare class Obj {
    #private;
    constructor(objects: ObjectRecord);
    static pick<T extends ObjectRecord, K extends Path<T>>(source: T, props: K | K[]): NestedPick<T, K>;
    static omit<T extends ObjectRecord, K extends Path<T>>(source: T, props: K | K[]): NestedOmit<T, K>;
    static excludes<T extends ObjectRecord, K extends Path<T>>(source: T, props: K | K[]): NestedOmit<T, K>;
    static contains(source: ObjectRecord, target: ObjectRecord | string): boolean;
    static extends<T extends ObjectRecord, O extends ObjectRecord[]>(target: T, ...sources: O): ExtendsObjects<T, O>;
    static reset<T extends undefined | null | ObjectRecord>(obj: ObjectRecord, newData?: T): DefaultObject<T>;
    static from(o: ObjectRecord): Obj;
    static initPropValue<T>(o: ObjectRecord, prop: string, value: T): T;
    contains(target: ObjectRecord | string): boolean;
    extends(...sources: ObjectRecord[]): ExtendsObject<ObjectRecord, {}>;
    reset<T extends ObjectRecord>(newData?: T): DefaultObject<T>;
    initPropValue<T>(prop: string, value: T): T;
    valueOf(): ObjectRecord;
    toString(): string;
}
