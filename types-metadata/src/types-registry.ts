import {IPropertyMetadata, IType, ITypeConfigurator, ITypeMetadata, ITypesRegistry} from "./common-interfaces";
import {TypeMetadata} from "./type-metadata";

export class TypesRegistry implements ITypesRegistry {
    private _typesByAlias = new Map<string, TypeMetadata>();
    private _typesByCtrName = new Map<string, TypeMetadata>();
    private _typesByCtr = new Map<IType<any>, TypeMetadata>();

    bindTypeAlias<T>(type: IType<T>, alias: string): void {
        this.forType(type).
    }

    configureType<T>(type: IType<T>, setup: (configurator: ITypeConfigurator<T>) => (ITypeConfigurator<T> | void)) {
    }

    forProperty<T>(typeRef: IType<T>, prop: keyof T): IPropertyMetadata<T> {
        return undefined;
    }

    forType<T>(type: IType<T>): ITypeMetadata<T> {
        return undefined;
    }

    getTypeAlias<T>(type: IType<T>): string {
        return "";
    }

    getTypeExtension<T, TExtension>(type: IType<T>, extType: IType<TExtension>): TExtension {
        return undefined;
    }

    resolveType(typeAlias: string): ITypeMetadata {
        return undefined;
    }

}