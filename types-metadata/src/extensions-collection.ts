import {IActiveExtension, IMetadataExtensionsManager, IType, MetadataExtensionAction} from "./common-interfaces";
import {getConstructorName} from "./utils";

export class ExtensionsCollection<T> implements IMetadataExtensionsManager {
    private _extensions = new Map<string, any>();

    public readonly typeName: string;
    public readonly propName: string;
    constructor(private readonly type:IType<T>, private readonly prop:keyof T) {
        this.typeName = getConstructorName(type);
        this.propName = String(prop);
    }

    _reconfigure(ext:IActiveExtension, action:MetadataExtensionAction) {
        if (ext.configure) {
            ext.configure(action, this.type, this.prop);
        }
    }

    addExtension<TExtension>(extType: IType<TExtension>, ext: TExtension): IMetadataExtensionsManager {
        let extensionId = getConstructorName(extType);
        let oldExt = this._extensions.get(extensionId) as TExtension;
        if (oldExt && oldExt !== ext) {
            throw new Error(`Extension ${extensionId} already applied`);
        }
        this._extensions.set(extensionId, ext);
        this._reconfigure(ext as IActiveExtension, MetadataExtensionAction.Add);
        return this;
    }

    configureExtension<TExtension>(extType: IType<TExtension>, ext: Partial<TExtension>): IMetadataExtensionsManager {
        let extensionId = getConstructorName(extType);
        let oldExt = this._extensions.get(extensionId);
        let isAdd: boolean;
        if (!oldExt) {
            oldExt = new extType();
            this._extensions.set(extensionId, oldExt);
            isAdd = true;
        }
        Object.assign(oldExt, ext);
        this._reconfigure(oldExt, isAdd ? MetadataExtensionAction.Add : MetadataExtensionAction.Update);
        return undefined;
    }

    getExtension<TExtension>(extType: IType<TExtension>, required?: boolean): TExtension {
        let extensionId = getConstructorName(extType);
        let extObj = this._extensions.get(extensionId);
        if (extObj === undefined && required) {
            throw new Error(`Unknown extension on ${this.typeName}${this.prop ? "::" : ""}${this.prop ? this.propName : ""}`);
        }
        return extObj;
    }

    hasExtension<TExtension>(extType: IType<TExtension>): boolean {
        return this._extensions.has(getConstructorName(extType));
    }

}