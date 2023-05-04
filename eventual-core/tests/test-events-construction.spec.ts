import {describe} from "mocha";
import {createEventsFactory} from "../src";
import {createTypesRegistry} from "@sakartvelosoft/types-metadata";

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
    })
})