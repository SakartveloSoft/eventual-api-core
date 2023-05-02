
export interface IType<T> {
    new():T;
    name: string;
}

export interface ITypeConfigurator<T=any> {
    bindAlias(alias:string):ITypeConfigurator<T>;
    withDefaultValues(values:Partial<T>):ITypeConfigurator<T>;

    withExtensions<TResult>(extUsage:(manager:IMetadataExtensionsManager) => TResult|void):ITypeConfigurator<T>;
    withPropertyExtensions<TProp, TResult>(prop:keyof T, extUsage:(manager:IMetadataExtensionsManager) => TResult|void):ITypeConfigurator<T>;

    useExtensions<TResult>(extUsage:(manager:IMetadataExtensionsManager) => TResult):TResult;
    usePropertyExtensions<TResult>(prop:keyof T, extUsage:(manager:IMetadataExtensionsManager) => TResult):TResult;

    withPropertyGenerator(prop:keyof T, generator:(vales?:T) => any):ITypeConfigurator<T>;


}

export interface IMetadataExtensionsManager {
    hasExtension<TExtension>(extType:IType<TExtension>):boolean;
    addExtension<TExtension>(extType:IType<TExtension>, ext:TExtension):IMetadataExtensionsManager;
    configureExtension<TExtension>(extType:IType<TExtension>, ext:Partial<TExtension>):IMetadataExtensionsManager;
    getExtension<TExtension>(extType:IType<TExtension>, required?:boolean):TExtension;

}

export enum MetadataExtensionAction {
    Add = "add",
    Update = "update"
}
export interface IActiveExtension<T=any> {
    configure?( action: MetadataExtensionAction|string, type:IType<T>, prop?:keyof T): void;
}

export interface ITypeMetadata<T=any> {
    readonly name: string;
    readonly alias: string;

    readonly extensions:IMetadataExtensionsManager;

    createEmpty():T;
    rebuild(props:Partial<T>):T;

    forProperty(prop:keyof T):IPropertyMetadata<T>;
    resolveProperty(alias:string):IPropertyMetadata<T>;
}

export interface IPropertyMetadata<T> {
    readonly typeName: string;
    readonly alias: string;
    readonly prop:keyof T;

    readonly extensions:IMetadataExtensionsManager;

    getDefaultValue(forInstance:T):any;
    withDefaultValue(value:any):IPropertyMetadata<T>;
    withGenerator<TProp>(func:(values?:T) => TProp):IPropertyMetadata<T>;

}
export interface ITypesRegistry {
    getTypeAlias<T>(type:IType<T>):string;
    bindTypeAlias<T>(type:IType<T>, alias:string):void;
    configureType<T>(type:IType<T>, setup:(configurator:ITypeConfigurator<T>) => (ITypeConfigurator<T>|void));
    forType<T>(type:IType<T>):ITypeMetadata<T>;
    forProperty<T>(typeRef:IType<T>, prop:keyof T):IPropertyMetadata<T>;
    resolveType(typeAlias:string):ITypeMetadata;

    getTypeExtension<T, TExtension>(type:IType<T>, extType:IType<TExtension>):TExtension;

    create<T>(ctr:IType<T>, values?:Partial<T>):T;
    produceEmpty<T=any>(typeAlias:string, values?:Partial<T>):T;
}