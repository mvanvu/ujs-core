import { Path, NestedPick, NestedOmit, ExtendsObject, ExtendsObjects, DefaultObject, ObjectRecord } from '../type';
export declare class Obj<OT extends ObjectRecord> {
    #private;
    constructor(objects: OT);
    get objects(): OT;
    static pick<T extends ObjectRecord, K extends Path<T>>(source: T, props: K | K[]): NestedPick<T, K>;
    static omit<T extends ObjectRecord, K extends Path<T>>(source: T, props: K | K[]): NestedOmit<T, K>;
    static excludes<T extends ObjectRecord, K extends Path<T>>(source: T, props: K | K[]): NestedOmit<T, K>;
    static contains(source: ObjectRecord, target: ObjectRecord | string): boolean;
    static extends<T extends ObjectRecord, O extends ObjectRecord[]>(target: T, ...sources: O): ExtendsObjects<T, O>;
    static reset<T extends undefined | null | ObjectRecord>(obj: ObjectRecord, newData?: T): DefaultObject<T>;
    static from<OT>(o: OT): Obj<OT>;
    static initPropValue<T>(o: ObjectRecord, prop: string, value: T): T;
    contains(target: ObjectRecord | string): boolean;
    extends(...sources: ObjectRecord[]): OT extends object ? ExtendsObject<OT, {}> : never;
    reset<T extends ObjectRecord>(newData?: T): DefaultObject<T>;
    initPropValue<T extends any>(prop: string, value: T): T;
    omit<K extends Path<OT>>(props: K | K[]): NestedOmit<OT, K>;
    valueOf(): OT;
    toString(): string;
}
