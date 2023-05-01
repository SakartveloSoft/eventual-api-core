import {ITypesRegistry} from "./common-interfaces";
import {TypesRegistry} from "./types-registry";

export {
    IPropertyMetadata,
    IMetadataExtensionsManager,
    ITypeConfigurator,
    ITypeMetadata,
    ITypesRegistry,
} from "./common-interfaces";

export function createTypesRegistry():ITypesRegistry {
    return new TypesRegistry();
}