import {IEventsFactory} from "./events-interfaces";
import {EventsFactory} from "./events-factory";
import {ITypesRegistry} from "@sakartvelosoft/types-metadata";

export {
    EventDetails,
    EventCreationOptions,
    EventMetadata,
    EventsFactory
} from "./eventual-interfaces";

export {
    makeIncrementalEventIdGenerator
} from "./incremental-event-id"


export function createEventsFactory(typesRegistry:ITypesRegistry, eventIdGenerator:EventsFactory):IEventsFactory {
    return new EventsFactory(typesRegistry, eventIdGenerator);
}