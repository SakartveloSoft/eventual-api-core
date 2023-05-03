import {EventDetails} from "./events-interfaces";

export class EventRecord<T extends object=object> implements EventDetails<T> {
    data: T;
    id: string;
    timestamp: Date;
    type: string;
    preferredChannel: string;
    scopeOrModuleId: string;
    source: string;
    targets: string[];

}