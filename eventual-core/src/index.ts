import {IEventsFactory, IEventsFactoryOptions} from "./events-interfaces";
import {EventsFactory} from "./events-factory";
import {ITypesRegistry} from "@sakartvelosoft/types-metadata";


export {
    EventDetails,
    EventCreationOptions,
    EventMetadata,
    IEventsFactoryOptions,
    IEventsFactory
} from "./events-interfaces";



export function createEventsFactory(typesRegistry:ITypesRegistry, eventFactorOptions:IEventsFactoryOptions):IEventsFactory {
    return new EventsFactory(typesRegistry, eventFactorOptions);
}