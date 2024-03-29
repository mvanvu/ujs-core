import { EventHandler } from '../type';
export declare class EventEmitter {
    #private;
    static get HIGH(): 100;
    static get MEDIUM(): 50;
    static get NORMAL(): 25;
    static get LOW(): 0;
    get events(): EventHandler[];
    static getInstance(): EventEmitter;
    on(name: string, handler: EventHandler['handler'], priority?: number): this;
    once(name: string, handler: EventHandler['handler']): this;
    has(name: string): boolean;
    remove(name?: string | string[]): this;
    off(name?: string | string[]): this;
    open(name?: string | string[]): this;
    getEventHandlers(name: string | string[]): EventHandler[];
    emit(name: string | string[], ...args: any[]): any[];
    emitAsync(name: string | string[], ...args: any[]): Promise<any[]>;
    emitAsyncSequently(name: string | string[], ...args: any[]): Promise<any[]>;
}
