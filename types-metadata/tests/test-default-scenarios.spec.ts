import {createTypesRegistry} from "../src";
import {expect} from "chai";
import {randomBytes} from "crypto";

describe('test default scenarios for types metadata', () => {
    it('Test extensions definition basic functionality', () => {
        class TestClass {
            prop1: string;
            prop2: boolean;
            prop3: number;
            prop4: Date;
        }
        let registry = createTypesRegistry();
        registry.bindTypeAlias(TestClass, 'test-class');
        expect(registry.getTypeAlias(TestClass)).eq('test-class');
        expect(registry.resolveType('test-class').alias).eq('test-class');
        expect(registry.resolveType('test-class').name).eq(TestClass.name);
        expect(registry.resolveType('TestClass')).equal(registry.resolveType('test-class'));

    });

    it('Test default value for properties', () => {
        class TestClass2 {
            text: string;
        }

        let registry = createTypesRegistry();
        registry.configureType(TestClass2, api => api.withDefaultValues({
            text: 'DEFAULT TEXT'
        }));
        let instance = registry.forType(TestClass2).createEmpty();
        expect(instance.text).to.be.eq("DEFAULT TEXT");
    });

    it('Test shorthand creation API', () => {
        class TestRecord {
            timestamp: Date;
            id: string;
            text: string
        }

        let registry = createTypesRegistry();
        registry.configureType(TestRecord, api => api.withPropertyGenerator('timestamp', () => new Date())
            .withPropertyGenerator('id', () => randomBytes(32).toString('base64url')));
        let rec = registry.create<TestRecord>(TestRecord, {
            text: 'Testing'
        });
        expect(rec).instanceof(TestRecord);
        expect(typeof rec.id).is.eq('string');
        expect(rec.timestamp).instanceof(Date);
        expect(rec.text).eq('Testing');
    })
})