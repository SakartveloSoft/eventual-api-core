import {
    EventCreationOptions,
    EventDetails,
    EventMetadata,
    IEventsFactory,
    IEventsFactoryOptions
} from "./events-interfaces";
import {IType} from "@sakartvelosoft/types-metadata/dist/src/common-interfaces";
import {getConstructorName, ITypesRegistry} from "@sakartvelosoft/types-metadata";
import {EventRecord} from "./event-record";

import {
    ID_FORMAT_PREFIX_IDENTITY,
    ID_FORMAT_PREFIX_MACHINE_IDENTITY,
    makeIdGenerator
} from "@sakartvelosoft/id-generation";

function generateTimestamp():Date {
    return new Date();
}

export class EventsFactory implements IEventsFactory {
    constructor(private readonly typesRegistry:ITypesRegistry, private readonly options?:IEventsFactoryOptions) {
        let defaultSource = options?.source || null;
        let idFactory = options.eventIdFactory ? () => options.eventIdFactory() : makeIdGenerator({
            format: ID_FORMAT_PREFIX_IDENTITY,
            prefix: 'event',
            identityKind: 'random'
        });
        typesRegistry.configureType(EventRecord, api => {
            api.withPropertyGenerator('id', idFactory);
            api.withPropertyGenerator("timestamp", generateTimestamp);
            api.withPropertyGenerator('source', defaultSource);
        });
    }

    registerEventsType(eventType: IType<T>, typeAlias?: string) {
        this.typesRegistry.configureType(eventType, (api) => {
            api.bindAlias(typeAlias || getConstructorName(eventType));
        });
    }

    createEvent<T>(eventType: IType<T>, data: Partial<T>, options?: EventCreationOptions): EventDetails<T> {
        let fullData = this.typeRegistry.create(eventType, data);
        let finalTypeName = this.typesRegistry.forType(eventType).alias || getConstructorName(eventType);
        let finalSource = options.source || this.options?.source || null;
        let fullTargets = options?.targets || this.options?.targets || null;
        if (this.options?.targetsCleanup) {
            fullTargets = this.options.targetsCleanup(finalTypeName, finalSource, fullTargets);
        }
        return this.typesRegistry.create(EventRecord,{
            data: fullData,
            source: finalSource,
            targets:  fullTargets,
            type: finalTypeName
        });
    }

    rebuildEvent<T = any>(eventMetadata: EventMetadata, data: T): EventDetails<T> {
        return Object.assign(new EventRecord(), {
            type: eventMetadata.type,
            id: eventMetadata.type,
            source: eventMetadata.source || null,
            targets: eventMetadata.targets || null,
            timestamp: eventMetadata.timestamp || null,
            data: this.typesRegistry.resolveType(eventMetadata.type)
        } as Partial<EventRecord>)
    }
}