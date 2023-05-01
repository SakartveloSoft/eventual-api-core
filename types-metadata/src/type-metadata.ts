import {
    IMetadataExtensionsManager,
    IPropertyMetadata,
    IType,
    ITypeConfigurator,
    ITypeMetadata
} from "./common-interfaces";
import {PropertyMetadata} from "./property-metadata";
import {ExtensionsCollection} from "./extensions-collection";
import {getConstructorName} from "./utils";

export class TypeMetadata<T=any> implements ITypeMetadata<T>, ITypeConfigurator<T> {
    alias: string;
    readonly extensions: IMetadataExtensionsManager;
    readonly name: string;


    private _propertiesMap = new Map<string, PropertyMetadata<T>>();

    constructor(private readonly ctr:IType<T>, private readonly _aliasUpdateCallback:(oldAlias:string, alias:string, metadata:TypeMetadata) => void) {
        this.extensions = new ExtensionsCollection(ctr, null);
        this.alias = getConstructorName(ctr);
    }

    bindAlias(alias: string): ITypeConfigurator<T> {
        let oldAlias = this.alias;
        if (oldAlias !== alias) {
            this.alias = alias;
            this._aliasUpdateCallback(oldAlias, alias, this);
        }
        return this;
    }

    createEmpty(): T {
        return new this.ctr();
    }

    forProperty(prop: keyof any): IPropertyMetadata<any> {
        return undefined;
    }

    rebuild(props: Partial<any>): any {
        return Object.assign(new this.ctr(), props);
    }

    resolveProperty(alias: string): IPropertyMetadata<any> {
        return undefined;
    }

    useExtensions<TResult>(extUsage: (manager: IMetadataExtensionsManager) => TResult): TResult {
        return undefined;
    }

    usePropertyExtensions<TResult>(extUsage: (manager: IMetadataExtensionsManager) => TResult): TResult {
        return undefined;
    }

    withDefaultValues(values: Partial<any>): ITypeConfigurator<any> {
        return undefined;
    }

    withExtensions<TResult>(extUsage: (manager: IMetadataExtensionsManager) => (void | TResult)): ITypeConfigurator<any> {
        return undefined;
    }

    withPropertyExtensions<TProp, TResult>(prop: keyof any, extUsage: (manager: IMetadataExtensionsManager) => (void | TResult)): ITypeConfigurator<any> {
        return undefined;
    }

}