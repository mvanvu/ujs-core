export declare class FooSchema {
    uint: number;
    email: string;
}
export declare class BarSchema {
    content: string;
    foo: FooSchema;
    def?: number[];
}
