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

export interface EventDetails<T extends object> extends EventMetadata {
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

export interface IEventFactoryEntry<T extends object> {
    create(data:Partial<T>, options?:EventCreationOptions):EventDetails<T>;
    rebuild(metadata:EventMetadata, data:T):EventDetails<T>;
}
export interface IEventsFactory {
    registerEventsType<T extends object>(eventType:IType<T>, typeAlias?:string):void;
    forEvent<T extends object>(eventType:IType<T>):IEventFactoryEntry<T>;
    createEvent<T extends object>(eventType:IType<T>, data:Partial<T>, options?:EventCreationOptions):EventDetails<T>;
    rebuildEvent<T extends object=object>(eventMetadata:EventMetadata, data:T):EventDetails<T>;
}
