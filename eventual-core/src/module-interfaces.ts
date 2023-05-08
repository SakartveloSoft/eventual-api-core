import {EventMetadata} from "./events-interfaces";
import {IType} from "@sakartvelosoft/types-metadata";

export type EventCallback<T extends object> = (eventData:T, eventMetadata:EventMetadata) => void|Promise<void>;
export type UnsubscribeCallback = () => void;

export interface IEventEntryEmitOptions {
    targets?:string[];
    preferredChannel?:string;

}
export interface ModuleEventEntry<T extends object> {
    subscribe(callback:EventCallback<T>):UnsubscribeCallback;
    unsubscribe(callback:EventCallback<T>);
    emit(data:Partial<T>, options?:IEventEntryEmitOptions);
}
export interface IModuleInterfaceDefinitionFactory {
    event<T extends object>(eventType:IType<T>):ModuleEventEntry<T>;

}