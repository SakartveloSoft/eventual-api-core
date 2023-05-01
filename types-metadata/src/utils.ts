import {IType} from "./common-interfaces";

export function getConstructorName<T=any>(type:IType<T>):string {
    return type.name;
}