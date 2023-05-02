import {IPropertyMetadata, IType, ITypeConfigurator, ITypeMetadata, ITypesRegistry} from "./common-interfaces";
import {TypeMetadata} from "./type-metadata";

export class TypesRegistry implements ITypesRegistry {
    private _typesByAlias = new Map<string, TypeMetadata>();
    private _typesByCtrName = new Map<string, TypeMetadata>();
    private _typesByCtr = new Map<IType<any>, TypeMetadata>();

    private _resolveType<T>(type:IType<T>):TypeMetadata<T> {
        let meta = this._typesByCtr.get(type);
        if (!meta) {
            meta = new TypeMetadata(type, this._aliasChanged.bind(this));
            this._typesByCtr.set(type, meta);
            this._typesByCtrName.set(meta.name, meta);
            this._typesByAlias.set(meta.alias || meta.name, meta);
        }
        return meta;
    }

    _aliasChanged(oldAlias: string, newAlias: string, meta:TypeMetadata) {
        if (oldAlias != newAlias) {
            this._typesByAlias.delete(oldAlias);
            this._typesByAlias.set(newAlias, meta);
        }
    }

    bindTypeAlias<T>(type: IType<T>, alias: string): void {
        this.configureType(type, c => c.bindAlias(alias));
    }

    configureType<T>(type: IType<T>, setup: (configurator: ITypeConfigurator<T>) => (ITypeConfigurator<T> | void)) {
        setup(this._resolveType(type));
    }

    forProperty<T>(typeRef: IType<T>, prop: keyof T): IPropertyMetadata<T> {
        return this._resolveType(typeRef).forProperty(prop);
    }

    forType<T>(type: IType<T>): ITypeMetadata<T> {
        return this._resolveType(type);
    }

    getTypeAlias<T>(type: IType<T>): string {
        return this._resolveType(type).alias;
    }

    getTypeExtension<T, TExtension>(type: IType<T>, extType: IType<TExtension>): TExtension {
        return this._resolveType(type).extensions.getExtension(extType);
    }

    resolveType(typeAlias: string): ITypeMetadata {
        let meta = this._typesByCtrName.get(typeAlias) || this._typesByAlias.get(typeAlias);
        if (!meta) {
            throw new Error(`Unknown type ${typeAlias}`);
        }
        return meta;
    }

    create<T>(ctr: IType<T>, values: Partial<T>): T {
        let typeMeta = this.forType(ctr);
        return (values === undefined || values === null ? typeMeta.createEmpty() : typeMeta.rebuild(values));
    }

    produceEmpty<T = any>(typeAlias: string): T {
        let type = this.resolveType(typeAlias);
        return type.createEmpty();
    }


}