import {ITypesRegistry} from "./common-interfaces";
import {TypesRegistry} from "./types-registry";

export {
    IPropertyMetadata,
    IType,
    IActiveExtension,
    MetadataExtensionAction,
    IMetadataExtensionsManager,
    ITypeConfigurator,
    ITypeMetadata,
    ITypesRegistry,
} from "./common-interfaces";

export { getConstructorName } from "./utils";
export { DefaultValue} from "./default-value-extension";
export { DefaultValueGenerator } from "./default-value-generator";
export function createTypesRegistry():ITypesRegistry {
    return new TypesRegistry();
}