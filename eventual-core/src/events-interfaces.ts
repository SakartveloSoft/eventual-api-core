import {IType} from "@sakartvelosoft/types-metadata/dist/src/common-interfaces";



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
    eventIdFactory?:EventIdFactory;
    source?:string;
    targets?:string[];
    targetsCleanup?:(eventType: string, source:string, targets:string[]) => string[];
}

export interface IEventsFactory {
    registerEventsType(eventType:IType<T>, typeAlias?:string):void;
    createEvent<T=any>(eventType:IType<T>, data:Partial<T>, options?:EventCreationOptions):EventDetails<T>;
    rebuildEvent<T=any>(eventMetadata:EventMetadata, data:T):EventDetails<T>;
}
