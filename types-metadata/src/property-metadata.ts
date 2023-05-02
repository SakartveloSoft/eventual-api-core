import {IMetadataExtensionsManager, IPropertyMetadata, IType} from "./common-interfaces";
import {getConstructorName} from "./utils";
import {DefaultValue} from "./default-value-extension";
import {ExtensionsCollection} from "./extensions-collection";
import {DefaultValueGenerator} from "./default-value-generator";

export class PropertyMetadata<T=any> implements IPropertyMetadata<T>{
    readonly alias: string;
    readonly extensions: IMetadataExtensionsManager;
    readonly typeName: string;
    constructor(public readonly type:IType<T>, public readonly prop: keyof T) {
        this.typeName = getConstructorName(type);
        this.prop = prop;
        this.alias = String(prop);
        this.extensions = new ExtensionsCollection(type, prop);
    }

    getDefaultValue(instance:T):any {
        if (this.extensions.hasExtension(DefaultValueGenerator)) {
            return this.extensions.getExtension(DefaultValueGenerator, true).generator(instance);
        }
        return this.extensions.getExtension(DefaultValue, false)?.value;
    }

    withDefaultValue(value:any):IPropertyMetadata<T> {
        this.extensions.configureExtension(DefaultValue, { value: value });
        return this;
    }

    withGenerator<TProp>(func:(values?:T) => TProp):IPropertyMetadata<T> {
        this.extensions.configureExtension(DefaultValueGenerator, { generator: func});
        return this;
    }

}