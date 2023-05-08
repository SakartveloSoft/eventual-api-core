import {describe} from "mocha";
import {createEventsFactory} from "../src";
import {createTypesRegistry} from "@sakartvelosoft/types-metadata";
import {expect} from "chai";

describe('Test events construction and rebuilding', () => {
    class TestEvent {
        message: string;
    }
    it('Construct event', () => {
        const eventFactory = createEventsFactory(createTypesRegistry(), { source: 'test' });
        eventFactory.registerEventsType(TestEvent, 'test-event');
        const newEvent = eventFactory.createEvent(TestEvent, {
            message: "Test"
        });
        expect(newEvent.type).eq('test-event');
        expect(newEvent.data).instanceof(TestEvent);
        expect(newEvent.data.message).eq('Test');
    });
    it('Construct event via entry', () => {
        const eventFactory = createEventsFactory(createTypesRegistry(), { source: 'test' });
        eventFactory.registerEventsType(TestEvent, 'test-event');
        const entry = eventFactory.forEvent(TestEvent);
        const newEvent = entry.create( {
            message: "Test"
        }, {
            source: 'test'
        });
        expect(newEvent.type).eq('test-event');
        expect(newEvent.data).instanceof(TestEvent);
        expect(newEvent.source).eq('test');
        expect(newEvent.data.message).eq('Test');
    })
});