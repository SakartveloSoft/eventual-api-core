import {IType} from "@sakartvelosoft/types-metadata";
import {CallableIdFactory} from "@sakartvelosoft/id-generation";



export interface EventMetadata {
    type: string;
    id: string;
    timestamp: Date;
    source:string;
    targets?: string[];

    scopeOrModuleId?: string;

    preferredChannel?:string;

}

export interface EventDetails<T> extends EventMetadata {
    data: T;
}

export interface EventCreationOptions {
    source?: string;
    targets?:string[];

    scopeOrModuleId?: string;

    preferredChannel?:string;
}

export interface IEventsFactoryOptions {
    eventIdFactory?:CallableIdFactory;
    source?:string;
    targets?:string[];
    targetsCleanup?:(eventType: string, source:string, targets:string[]) => string[];
}

export interface IEventFactoryEntry<T> {
    create(data:Partial<T>, options?:EventCreationOptions):EventDetails<T>;
    rebuild<T>(metadata:EventMetadata, data:T):EventDetails<T>;
}
export interface IEventsFactory {
    registerEventsType<T>(eventType:IType<T>, typeAlias?:string):void;
    forEvent<T>(eventType:IType<T>):IEventFactoryEntry<T>;
    createEvent<T>(eventType:IType<T>, data:Partial<T>, options?:EventCreationOptions):EventDetails<T>;
    rebuildEvent<T>(eventMetadata:EventMetadata, data:T):EventDetails<T>;
}
