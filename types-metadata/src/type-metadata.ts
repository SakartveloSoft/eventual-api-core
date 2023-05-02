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
        this.name = getConstructorName(ctr);
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

    private _applyDefaultValues(instance:any):void {
        for(let [prop, meta] of this._propertiesMap) {
            let defaultValue = meta.getDefaultValue(instance);
            if (defaultValue !== undefined) {
                instance[prop] = defaultValue;
            }
        }
    }
    createEmpty(): T {
        let instance =  new this.ctr();
        this._applyDefaultValues(instance);
        return instance;
    }

    forProperty(prop: keyof T): IPropertyMetadata<any> {
        let propName = String(prop);
        let propMeta = this._propertiesMap.get(propName);
        if (!propMeta) {
            propMeta = new PropertyMetadata<T>(this.ctr, prop);
            this._propertiesMap.set(propName, propMeta);
        }
        return propMeta;
    }

    rebuild(props: Partial<any>): any {
        return Object.assign(this.createEmpty(), props);
    }

    resolveProperty(alias: string): IPropertyMetadata<any> {
        let propMeta = this._propertiesMap.get(alias);
        if (!propMeta) {
            throw new Error(`Unknown property ${propMeta}`);
        }
        return propMeta;
    }

    useExtensions<TResult>(extUsage: (manager: IMetadataExtensionsManager) => TResult): TResult {
        return extUsage(this.extensions);
    }

    usePropertyExtensions<TResult>(prop:keyof T, extUsage: (manager: IMetadataExtensionsManager) => TResult): TResult {
        return undefined;
    }

    withDefaultValues(values: Partial<any>): ITypeConfigurator<T> {
        if(values) {
            for(let [prop, value] of Object.entries(values)) {
                this.forProperty(prop as keyof T).withDefaultValue(value);
            }
        }
        return this;
    }

    withExtensions<TResult>(extUsage: (manager: IMetadataExtensionsManager) => (void | TResult)): ITypeConfigurator<T> {
        extUsage(this.extensions);
        return undefined;
    }

    withPropertyExtensions<TProp, TResult>(prop: keyof T, extUsage: (manager: IMetadataExtensionsManager) => (void | TResult)): ITypeConfigurator<T> {
        extUsage(this.forProperty(prop).extensions);
        return this;
    }

    withPropertyGenerator(prop: keyof T, generator: (vales?: T) => any): ITypeConfigurator<T> {
        this.forProperty(prop).withGenerator(generator);
        return this;
    }

}