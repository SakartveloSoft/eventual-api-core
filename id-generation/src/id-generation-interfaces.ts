export type CallableIdFactory = () => string;

export interface IdFactoryOptions {
    /**
     * optional prefix, common for all ids
     */
    prefix?:string;
    /**
     * set to `false` to skip prefix based on initialization time from generated id
     */
    includeInitializationTime?:boolean;
    /**
     * set to `false` to skip machine name from id format
     */
    includeMachineName?:boolean;
    /**
     * overall format of generated event id. Default is `[prefix]_[machine]_[init_time]_[identity]`
     */
    format?: string;
    /**
     * Set by default to `true` if you use identity type of `random` and `_` (underscore) as separator included to `format`
     */
    allowMultipleUnderscores?:boolean;
    identityKind:"random"|"incremental"|"custom",
    customIdentityGenerator?:CallableIdFactory;
    /**
     * how many characters allocate for generated identity part - incremental or random
     */
    identityLength?:number;
}
