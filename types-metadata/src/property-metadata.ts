import {IMetadataExtensionsManager, IPropertyMetadata} from "./common-interfaces";

export class PropertyMetadata<T=any> implements IPropertyMetadata<T>{
    readonly alias: string;
    readonly extensions: IMetadataExtensionsManager;
    readonly prop: keyof T;
    readonly typeName: string;

}