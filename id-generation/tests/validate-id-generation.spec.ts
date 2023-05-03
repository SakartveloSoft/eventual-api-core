import {describe} from "mocha";
import {makeIdGenerator} from "../src";
import {expect} from "chai";
import {fail} from "assert";
import {randomBytes} from "crypto";
import {hostname} from "os";

describe('Test Id Generators', () => {
    it('Test minimal settings', () => {
        let testStart = new Date().getTime().toString(36);
        testStart = testStart.substring(0, testStart.length - 1);
        let generator = makeIdGenerator({
            identityKind: 'random',
            prefix: 'test'
        });
        let counters = new Map<string, number>();
        for(let x = 0; x < 1000; x++) {
            let id = generator();
            if (counters.has(id)) {
                fail(`${id} already has been generated`);
            }
            if (!id.includes(hostname())) {
                fail(`Generated ID ${id} does not have expected hostname`)
            }
            if (!id.includes(testStart)) {
                fail(`Generated id ${id} does not have init-time token ${testStart}`);
            }
            counters.set(id, 1);
            console.log(id);
        }

    })
    it('Test incremental generator with time prefix', () => {
        let generator = makeIdGenerator({
            format: 'test_[identity]',
            identityKind: 'incremental'
        });
        let result:string[] = [];
        for(let x = 0; x < 10; x++) {
            result.push(generator());
        }
        for(let id of result) {
            expect(id).match(/test_(\d|[a-z]){10}/);
        }
        let sortResult = result.slice().sort();
        expect(result).eql(sortResult);
    });

    it('Test random id generator', () => {
        let generator = makeIdGenerator({
            format: 'test_[identity]',
            identityKind: 'random',
            identityLength: 32
        });
        let counters = new Map<string, number>();
        for(let x = 0; x < 1000; x++) {
            let id = generator();
            expect(id).length(`test_`.length+ 32);
            if (counters.has(id)) {
                fail(`${id} already has been generated`);
            }
            counters.set(id, 1);
            console.log(id);
        }
    })

    it('Check custom id generator', () => {
        let generator = makeIdGenerator({
            format: 'test_[identity]',
            identityKind: 'custom',
            customIdentityGenerator: (() => {
               let bytes = randomBytes(32);
               let result = '';
               for(let x= 0; x < 4; x++) {
                   result = result.concat(bytes.readBigUInt64BE(x*8).toString(36));
               }
               return result.substring(0,32);
            })
        });
        let counters = new Map<string, number>();
        for(let x = 0; x < 1000; x++) {
            let id = generator();
            console.log(id);
            expect(id).match(/test_[0-9a-z]{32}/);
            if (counters.has(id)) {
                fail(`${id} already has been generated`);
            }
            counters.set(id, 1);
        }
    })
})