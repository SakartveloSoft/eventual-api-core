import {hostname as machineHostName} from "os";
import {randomBytes} from "crypto";
import {CallableIdFactory,  IdFactoryOptions} from "./id-generation-interfaces";


export function makeIncrementalIdentityGenerator(expectedLength?:number): () => string {
    expectedLength = expectedLength || 10;
    let lastId: bigint = 0n;
    return () => {
        lastId = lastId + 1n;
        return lastId.toString(36).padStart(expectedLength, '0');
    }
}

export function makeRandomIdentityGenerator(stringLength:number) {
    if (!stringLength) {
        stringLength = 16;
    }
    let binaryLength = Math.ceil((stringLength || 16) / (4/3));
    let binarySize = Math.max(binaryLength || 32, 8);
    return () => {
        let str = randomBytes(binarySize).toString('base64url');
        return str.length > stringLength ? str.substring(0, stringLength) : str;
    }
}

export const ID_FORMAT_DEFAULT = "[prefix]_[machine]_[init_time]_[identity]";
export const ID_FORMAT_PREFIX_MACHINE_IDENTITY = "[prefix]_[machine]_[identity]";
export const ID_FORMAT_PREFIX_IDENTITY = "[prefix]_[identity]";


export function makeIdGenerator(options:IdFactoryOptions):CallableIdFactory {
    let identityGenerator:CallableIdFactory;
    if (options.customIdentityGenerator) {
        identityGenerator = function useCustomEventIdentityGenerator() {
            return options.customIdentityGenerator()
        };
    } else {
        let finalIdentityLength = options?.identityLength || 16;
        switch (options?.identityKind) {
            case "incremental":
                identityGenerator = makeIncrementalIdentityGenerator(finalIdentityLength);
                break;
            case "random":
            case undefined:
            case null:
                identityGenerator = makeRandomIdentityGenerator(finalIdentityLength);
                break;
            case "custom":
                throw new Error(`Custom identity generator not provided`);
            default:
                throw new Error(`Unknown id generator kind : ${options.identityKind}`)
        }
    }
    let finalFormat = options?.format || ID_FORMAT_DEFAULT;
    if ((options?.identityKind === "custom" || options.identityKind === 'random') && finalFormat.includes('_') && options?.allowMultipleUnderscores === undefined) {
        options.allowMultipleUnderscores = true;
    }
    if (options.includeMachineName === false) {
        finalFormat = finalFormat.replace('[machine]', '');
    } else {
        finalFormat = finalFormat.replace('[machine]', machineHostName());
    }
    let initTime:string;
    if (options.includeInitializationTime === false) {
        initTime = '';
    } else {
        initTime = new Date().getTime().toString(36);
    }
    finalFormat = finalFormat.replace('[init_time]', initTime);
    if (options.prefix) {
        finalFormat = finalFormat.replace('[prefix]', options.prefix);
    } else {
        finalFormat = finalFormat.replace('[prefix]', '');
    }
    if (options?.allowMultipleUnderscores === false) {
        finalFormat = finalFormat.replace(/(_){2,}/g, '');
    }
    if (!finalFormat.includes('[identity]')) {
        finalFormat += '[identity]';
    }
    return () => {
        return finalFormat.replace(`[identity]`, identityGenerator());
    }
}

