export interface EventMetadata {
    type: string;
    id: string;
    timestamp: Date;
    source:string;
    targets?: string[];

}

export interface EventDetails<T> extends EventMetadata {
    data: T;
}

export interface EventCreationOptions {
    source: string;
    targets?:string[];
}
export interface EventsFactory {
    createEvent<T>(eventType:{new():T }, data:Partial<T>, options?:EventCreationOptions):EventDetails<T>;
    rebuildEvent<T=any>(eventMetadata:EventMetadata, data:T):EventDetails<T>;
}
