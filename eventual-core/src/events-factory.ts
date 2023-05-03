import {
    EventCreationOptions,
    EventDetails,
    EventMetadata,
    IEventsFactory,
    IEventsFactoryOptions
} from "./events-interfaces";
import {IType} from "@sakartvelosoft/types-metadata";
import {getConstructorName, ITypesRegistry} from "@sakartvelosoft/types-metadata";
import {EventRecord} from "./event-record";

import {
    CallableIdFactory,
    ID_FORMAT_PREFIX_IDENTITY,
    makeIdGenerator
} from "@sakartvelosoft/id-generation";

function generateTimestamp():Date {
    return new Date();
}

export class EventsFactory implements IEventsFactory {
    private readonly defaultSource:string;
    private readonly idFactory:CallableIdFactory;
    constructor(private readonly typesRegistry:ITypesRegistry, private readonly options?:IEventsFactoryOptions) {
        const defaultSource = options?.source || null;
        this.defaultSource = defaultSource;
        const idFactory = options.eventIdFactory ? () => options.eventIdFactory() : makeIdGenerator({
            format: ID_FORMAT_PREFIX_IDENTITY,
            prefix: 'event',
            identityKind: 'random'
        });
        this.idFactory = idFactory;
        typesRegistry.configureType(EventRecord, api => {
            api.withPropertyGenerator('id', idFactory);
            api.withPropertyGenerator("timestamp", generateTimestamp);
            api.withDefaultValues({ source:  defaultSource });
        });
    }

    registerEventsType<T extends object=object>(eventType: IType<T>, typeAlias?: string) {
        this.typesRegistry.configureType(eventType, (api) => {
            api.bindAlias(typeAlias || getConstructorName(eventType));
        });
    }

    createEvent<T extends object=object>(eventType: IType<T>, data: Partial<T>, options?: EventCreationOptions): EventDetails<T> {
        const fullData = this.typesRegistry.create(eventType, data);
        const finalTypeName = this.typesRegistry.forType(eventType).alias || getConstructorName(eventType);
        const finalSource = options.source || this.options?.source || null;
        let fullTargets = options?.targets || this.options?.targets || null;
        if (this.options?.targetsCleanup) {
            fullTargets = this.options.targetsCleanup(finalTypeName, finalSource, fullTargets);
        }
        return this.typesRegistry.create(EventRecord,{
            data: fullData,
            source: finalSource,
            targets:  fullTargets,
            type: finalTypeName,
            preferredChannel: options?.preferredChannel,
            scopeOrModuleId: options?.scopeOrModuleId
        }) as unknown as EventDetails<T>;
    }

    rebuildEvent<T extends object=object>(eventMetadata: EventMetadata, data: T): EventDetails<T> {
        return Object.assign(new EventRecord<T>(), {
            type: eventMetadata.type,
            id: eventMetadata.type,
            source: eventMetadata.source || null,
            targets: eventMetadata.targets || null,
            timestamp: eventMetadata.timestamp || null,
            scopeOrModuleId: eventMetadata.scopeOrModuleId || null,
            preferredChannel: eventMetadata.preferredChannel || null,
            data: this.typesRegistry.resolveType(eventMetadata.type).rebuild(data)
        } as Partial<EventRecord<T>>) as EventDetails<T>;
    }
}