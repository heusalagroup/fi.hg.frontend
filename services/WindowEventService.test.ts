// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import SpyInstance = jest.SpyInstance;
import { WindowEventService, 
    WindowEventServiceDestructor,
    WindowEventServiceEvent,
    WindowEventServiceJsonMessageEventCallback,
    WindowEventServiceMessageEventCallback,
    WindowEventServiceStringMessageEventCallback
} from "./WindowEventService";
import { LogService } from "../../core/LogService";
import {find, isFunction} from "../../core/modules/lodash";
import { LogLevel } from "../../core/types/LogLevel";

describe('WindowEventService', () => {

    let callback: SpyInstance | undefined;
    let callback2: SpyInstance | undefined;
    let windowAddListener: SpyInstance | undefined;
    let windowRemoveListener: SpyInstance | undefined;
    let windowParentAddListener: SpyInstance | undefined;
    let windowParentRemoveListener: SpyInstance | undefined;
    let listener: WindowEventServiceDestructor | undefined;
    let listener2: WindowEventServiceDestructor | undefined;

    beforeAll(() => {

        LogService.setLogLevel(LogLevel.WARN);

        windowAddListener = jest.spyOn(window, 'addEventListener');
        windowRemoveListener = jest.spyOn(window, 'removeEventListener');

    });

    afterEach(() => {

        if (listener) {
            listener();
            listener = undefined;
        }

        if (listener2) {
            listener2();
            listener2 = undefined;
        }

        WindowEventService.destroy();

        jest.clearAllMocks();

    });

    describe('.Event', () => {

        test('is WindowEventServiceEvent', () => {
            expect(WindowEventService.Event).toStrictEqual(WindowEventServiceEvent);
        });

    });

    describe('.on()', () => {

        test('can listen raw string events from current window', () => {

            expect(listener).toBe(undefined);

            callback = jest.fn();

            expect(windowAddListener).not.toHaveBeenCalled();

            listener = WindowEventService.on(WindowEventServiceEvent.MESSAGE_EVENT, callback as unknown as WindowEventServiceMessageEventCallback);

            expect(windowAddListener).toHaveBeenCalledTimes(1);

            // @ts-ignore
            expect(windowAddListener.mock.calls[0][0]).toBe('message');

            // @ts-ignore
            const eventCallback = windowAddListener.mock.calls[0][1];
            expect(isFunction(eventCallback)).toBe(true);

            expect(callback).not.toHaveBeenCalled();

            eventCallback({
                data: 'hello world',
                origin: 'unit test origin',
                source: 'unit test source'
            });

            expect(callback).toHaveBeenCalledTimes(1);

            const mockCall = find(callback.mock.calls, (item) => {
                return item[0] === WindowEventServiceEvent.MESSAGE_EVENT;
            });

            expect(mockCall[0]).toBe(WindowEventServiceEvent.MESSAGE_EVENT);
            expect(mockCall[1].data).toStrictEqual('hello world');
            expect(mockCall[1].origin).toStrictEqual('unit test origin');

        });

        test('can listen string messages from current window', () => {

            expect(listener).toBe(undefined);

            callback = jest.fn();

            expect(windowAddListener).not.toHaveBeenCalled();

            listener = WindowEventService.on(WindowEventServiceEvent.STRING_MESSAGE, callback as unknown as WindowEventServiceStringMessageEventCallback);

            expect(windowAddListener).toHaveBeenCalledTimes(1);

            // @ts-ignore
            expect(windowAddListener.mock.calls[0][0]).toBe('message');

            // @ts-ignore
            const eventCallback = windowAddListener.mock.calls[0][1];
            expect(isFunction(eventCallback)).toBe(true);

            expect(callback).not.toHaveBeenCalled();

            eventCallback({
                data: 'hello world',
                origin: 'unit test origin',
                source: 'unit test source'
            });

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith(WindowEventServiceEvent.STRING_MESSAGE, 'hello world', 'unit test origin');

        });

        test('can listen JSON messages from current window', () => {

            expect(listener).toBe(undefined);

            callback = jest.fn();

            expect(windowAddListener).not.toHaveBeenCalled();

            listener = WindowEventService.on(WindowEventServiceEvent.JSON_MESSAGE, callback as unknown as WindowEventServiceJsonMessageEventCallback);

            expect(windowAddListener).toHaveBeenCalledTimes(1);

            // @ts-ignore
            expect(windowAddListener.mock.calls[0][0]).toBe('message');

            // @ts-ignore
            const eventCallback = windowAddListener.mock.calls[0][1];
            expect(isFunction(eventCallback)).toBe(true);

            expect(callback).not.toHaveBeenCalled();

            eventCallback({
                data: '{"foo":"bar"}',
                origin: 'unit test origin',
                source: 'unit test source'
            });

            expect(callback).toHaveBeenCalledTimes(1);

            const mockCall = find(callback.mock.calls, (item) => {
                return item[0] === WindowEventServiceEvent.JSON_MESSAGE;
            });

            expect(mockCall[0]).toBe(WindowEventServiceEvent.JSON_MESSAGE);
            expect(mockCall[1]).toStrictEqual({foo: "bar"});
            expect(mockCall[2]).toStrictEqual('unit test origin');

        });

        test('can listen raw string events while listening string events from current window', () => {

            expect(listener).toBe(undefined);

            callback = jest.fn();
            callback2 = jest.fn();

            expect(windowAddListener).not.toHaveBeenCalled();

            listener = WindowEventService.on(WindowEventServiceEvent.MESSAGE_EVENT, callback as unknown as WindowEventServiceMessageEventCallback);

            listener2 = WindowEventService.on(WindowEventServiceEvent.STRING_MESSAGE, callback2 as unknown as WindowEventServiceStringMessageEventCallback);

            expect(windowAddListener).toHaveBeenCalledTimes(1);

            // @ts-ignore
            expect(windowAddListener.mock.calls[0][0]).toBe('message');

            // @ts-ignore
            const eventCallback = windowAddListener.mock.calls[0][1];
            expect(isFunction(eventCallback)).toBe(true);

            expect(callback).not.toHaveBeenCalled();
            expect(callback2).not.toHaveBeenCalled();

            eventCallback({
                data: 'hello world',
                origin: 'unit test origin',
                source: 'unit test source'
            });

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback.mock.calls[0][0]).toBe(WindowEventServiceEvent.MESSAGE_EVENT);
            expect(callback.mock.calls[0][1].data).toStrictEqual('hello world');
            expect(callback.mock.calls[0][1].origin).toStrictEqual('unit test origin');

            expect(callback2).toHaveBeenCalledTimes(1);
            expect(callback2).toHaveBeenCalledWith(WindowEventServiceEvent.STRING_MESSAGE, 'hello world', 'unit test origin');

        });

        test('can listen raw string events while listening JSON events from current window', () => {

            expect(listener).toBe(undefined);

            callback = jest.fn();
            callback2 = jest.fn();

            expect(windowAddListener).not.toHaveBeenCalled();

            listener = WindowEventService.on(WindowEventServiceEvent.MESSAGE_EVENT, callback as unknown as WindowEventServiceMessageEventCallback);

            listener2 = WindowEventService.on(WindowEventServiceEvent.JSON_MESSAGE, callback2 as unknown as WindowEventServiceJsonMessageEventCallback);

            expect(windowAddListener).toHaveBeenCalledTimes(1);

            // @ts-ignore
            expect(windowAddListener.mock.calls[0][0]).toBe('message');

            // @ts-ignore
            const eventCallback = windowAddListener.mock.calls[0][1];
            expect(isFunction(eventCallback)).toBe(true);

            expect(callback).not.toHaveBeenCalled();
            expect(callback2).not.toHaveBeenCalled();

            eventCallback({
                data: '{"hello":"world"}',
                origin: 'unit test origin',
                source: 'unit test source'
            });

            expect(callback).toHaveBeenCalledTimes(1);

            expect(callback.mock.calls[0][0]).toBe(WindowEventServiceEvent.MESSAGE_EVENT);
            expect(callback.mock.calls[0][1].data).toStrictEqual('{"hello":"world"}');
            expect(callback.mock.calls[0][1].origin).toStrictEqual('unit test origin');

            expect(callback2).toHaveBeenCalledTimes(1);
            expect(callback2.mock.calls[0][0]).toBe(WindowEventServiceEvent.JSON_MESSAGE);
            expect(callback2.mock.calls[0][1]).toStrictEqual({"hello": "world"});
            expect(callback2.mock.calls[0][2]).toStrictEqual('unit test origin');

        });

        test('can listen JSON messages with a string listener attached from current window', () => {

            expect(listener).toBe(undefined);

            callback = jest.fn();
            callback2 = jest.fn();

            expect(windowAddListener).not.toHaveBeenCalled();

            listener = WindowEventService.on(WindowEventServiceEvent.JSON_MESSAGE, callback as unknown as WindowEventServiceJsonMessageEventCallback);

            listener2 = WindowEventService.on(WindowEventServiceEvent.STRING_MESSAGE, callback2 as unknown as WindowEventServiceStringMessageEventCallback);

            expect(windowAddListener).toHaveBeenCalledTimes(1);

            // @ts-ignore
            expect(windowAddListener.mock.calls[0][0]).toBe('message');

            // @ts-ignore
            const eventCallback = windowAddListener.mock.calls[0][1];
            expect(isFunction(eventCallback)).toBe(true);

            expect(callback).not.toHaveBeenCalled();

            jest.clearAllMocks();

            eventCallback({
                data: '{}',
                origin: 'unit test origin',
                source: 'unit test source'
            });

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback2).not.toHaveBeenCalled();

            const mockCall = find(callback.mock.calls, (item) => {
                return item[0] === WindowEventServiceEvent.JSON_MESSAGE;
            });

            expect(mockCall[0]).toBe(WindowEventServiceEvent.JSON_MESSAGE);
            expect(mockCall[1]).toStrictEqual({});
            expect(mockCall[2]).toStrictEqual('unit test origin');

        });

        test('can listen string messages with a JSON listener attached from current window', () => {

            expect(listener).toBe(undefined);

            callback = jest.fn();
            callback2 = jest.fn();

            expect(windowAddListener).not.toHaveBeenCalled();

            listener = WindowEventService.on(WindowEventServiceEvent.STRING_MESSAGE, callback as unknown as WindowEventServiceStringMessageEventCallback);

            listener2 = WindowEventService.on(WindowEventServiceEvent.JSON_MESSAGE, callback2 as unknown as WindowEventServiceJsonMessageEventCallback);

            expect(windowAddListener).toHaveBeenCalledTimes(1);

            // @ts-ignore
            expect(windowAddListener.mock.calls[0][0]).toBe('message');

            // @ts-ignore
            const eventCallback = windowAddListener.mock.calls[0][1];
            expect(isFunction(eventCallback)).toBe(true);

            expect(callback).not.toHaveBeenCalled();

            jest.clearAllMocks();

            eventCallback({
                data: 'hello world',
                origin: 'unit test origin',
                source: 'unit test source'
            });

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback2).not.toHaveBeenCalled();

            const mockCall = find(callback.mock.calls, (item) => {
                return item[0] === WindowEventServiceEvent.STRING_MESSAGE;
            });

            expect(mockCall[0]).toBe(WindowEventServiceEvent.STRING_MESSAGE);
            expect(mockCall[1]).toStrictEqual('hello world');
            expect(mockCall[2]).toStrictEqual('unit test origin');

        });

    });

});
