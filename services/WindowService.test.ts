// Copyright (c) 2021-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {isFunction} from "../../core/modules/lodash";
import { WindowService,
    DARK_COLOR_SCHEME_QUERY,
    WindowServiceDestructor,
    WindowServiceEvent
} from "./WindowService";
import { LogService } from "../../core/LogService";
import SpyInstance = jest.SpyInstance;
import {ColorScheme} from "../../core/style/types/ColorScheme";
import { LogLevel } from "../../core/types/LogLevel";

describe('WindowService', () => {

    let callback : SpyInstance | undefined;
    let windowAddListener : SpyInstance | undefined;
    let windowRemoveListener : SpyInstance | undefined;
    let listener : WindowServiceDestructor | undefined;

    let windowMatchMediaMock = jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    }));

    beforeAll( () => {

        LogService.setLogLevel(LogLevel.WARN);

        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: windowMatchMediaMock
        });

        windowAddListener = jest.spyOn(window, 'addEventListener');
        windowRemoveListener = jest.spyOn(window, 'removeEventListener');

    });

    afterEach(() => {

        if (listener) {
            listener();
            listener = undefined;
        }

        WindowService.destroy();

        windowMatchMediaMock.mockClear();

        jest.clearAllMocks();

    });

    describe('.Event', () => {

        test('is WindowServiceEvent', () => {
            expect(WindowService.Event).toStrictEqual(WindowServiceEvent);
        });

    });

    describe('.on', () => {

        test('does not call the callback before event is triggered', () => {

            expect(listener).toBe(undefined);

            callback = jest.fn();
            listener = WindowService.on(WindowServiceEvent.COLOR_SCHEME_CHANGED, callback as unknown as WindowServiceDestructor);
            expect( callback ).not.toHaveBeenCalled();

        });

        test('can listen COLOR_SCHEME_CHANGED event from light to dark', () => {

            expect(listener).toBe(undefined);

            callback = jest.fn();

            const matchMediaResultSpy = {
                matches: false,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn()
            };

            windowMatchMediaMock.mockReturnValue(matchMediaResultSpy as unknown as MediaQueryList);

            listener = WindowService.on(WindowServiceEvent.COLOR_SCHEME_CHANGED, callback as unknown as WindowServiceDestructor);

            expect( windowMatchMediaMock ).toHaveBeenCalledTimes(1);
            expect( windowMatchMediaMock.mock.calls[0][0] ).toBe(DARK_COLOR_SCHEME_QUERY);

            // @ts-ignore
            expect( matchMediaResultSpy.addEventListener ).toHaveBeenCalledTimes(1);
            expect( matchMediaResultSpy.addEventListener.mock.calls[0][0] ).toBe('change');

            const eventCallback = matchMediaResultSpy.addEventListener.mock.calls[0][1];
            expect( isFunction(eventCallback) ).toBe(true);

            expect( callback ).not.toHaveBeenCalled();

            eventCallback({matches: true});

            expect( callback ).toHaveBeenCalledTimes(1);
            expect( callback.mock.calls[0][0] ).toBe(WindowServiceEvent.COLOR_SCHEME_CHANGED);
            expect( callback.mock.calls[0][1] ).toBe(ColorScheme.DARK);

        });

        test('can listen COLOR_SCHEME_CHANGED event from dark to light', () => {

            expect(listener).toBe(undefined);

            callback = jest.fn();

            const matchMediaResultSpy = {
                matches: true,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn()
            };

            windowMatchMediaMock.mockReturnValue(matchMediaResultSpy as unknown as MediaQueryList);

            listener = WindowService.on(WindowServiceEvent.COLOR_SCHEME_CHANGED, callback as unknown as WindowServiceDestructor);

            expect( windowMatchMediaMock ).toHaveBeenCalledTimes(1);
            expect( windowMatchMediaMock.mock.calls[0][0] ).toBe(DARK_COLOR_SCHEME_QUERY);

            // @ts-ignore
            expect( matchMediaResultSpy.addEventListener ).toHaveBeenCalledTimes(1);
            expect( matchMediaResultSpy.addEventListener.mock.calls[0][0] ).toBe('change');

            const eventCallback = matchMediaResultSpy.addEventListener.mock.calls[0][1];
            expect( isFunction(eventCallback) ).toBe(true);

            expect( callback ).not.toHaveBeenCalled();

            eventCallback({matches: false});

            expect( callback ).toHaveBeenCalledTimes(1);
            expect( callback.mock.calls[0][0] ).toBe(WindowServiceEvent.COLOR_SCHEME_CHANGED);
            expect( callback.mock.calls[0][1] ).toBe(ColorScheme.LIGHT);

        });

        test('can uninstall COLOR_SCHEME_CHANGED listener from window object', () => {

            expect(listener).toBe(undefined);

            callback = jest.fn();

            const matchMediaResultSpy = {
                matches: true,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn()
            };

            windowMatchMediaMock.mockReturnValue(matchMediaResultSpy as unknown as MediaQueryList);

            listener = WindowService.on(WindowServiceEvent.COLOR_SCHEME_CHANGED, callback as unknown as WindowServiceDestructor);

            expect( windowMatchMediaMock ).toHaveBeenCalledTimes(1);
            expect( windowMatchMediaMock.mock.calls[0][0] ).toBe(DARK_COLOR_SCHEME_QUERY);

            expect( matchMediaResultSpy.addEventListener ).toHaveBeenCalledTimes(1);
            expect( matchMediaResultSpy.addEventListener.mock.calls[0][0] ).toBe('change');

            const eventCallback = matchMediaResultSpy.addEventListener.mock.calls[0][1];
            expect( isFunction(eventCallback) ).toBe(true);

            expect( callback ).not.toHaveBeenCalled();

            expect( matchMediaResultSpy.removeEventListener ).not.toHaveBeenCalled();

            listener();
            listener = undefined;

            expect( matchMediaResultSpy.removeEventListener ).toHaveBeenCalledTimes(1);
            expect( matchMediaResultSpy.removeEventListener.mock.calls[0][0] ).toBe('change');
            expect( matchMediaResultSpy.removeEventListener.mock.calls[0][1] ).toStrictEqual(eventCallback);

        });

        test('can listen STORAGE_CHANGED events', () => {

            expect(listener).toBe(undefined);

            callback = jest.fn();

            const storageEventMock : Partial<StorageEvent> = {
                key: 'foo',
                newValue: 'hello',
                oldValue: 'world',
                storageArea: window.localStorage,
                url: 'example.com'
            };

            listener = WindowService.on(WindowServiceEvent.STORAGE_CHANGED, callback as unknown as WindowServiceDestructor);

            expect( windowAddListener ).toHaveBeenCalledTimes(1);
            // @ts-ignore
            expect( windowAddListener.mock.calls[0][0] ).toBe('storage');

            // @ts-ignore
            const eventCallback = windowAddListener.mock.calls[0][1];
            expect( isFunction(eventCallback) ).toBe(true);

            expect( callback ).not.toHaveBeenCalled();

            eventCallback(storageEventMock);

            expect( callback ).toHaveBeenCalledTimes(1);
            expect( callback.mock.calls[0][0] ).toBe(WindowServiceEvent.STORAGE_CHANGED);
            expect( callback.mock.calls[0][1] ).toStrictEqual(storageEventMock);

        });

        test('can uninstall STORAGE_CHANGED listener from window object', () => {

            expect(listener).toBe(undefined);

            callback = jest.fn();

            const storageEventMock : Partial<StorageEvent> = {
                key: 'foo',
                newValue: 'hello',
                oldValue: 'world',
                storageArea: window.localStorage,
                url: 'example.com'
            };

            listener = WindowService.on(WindowServiceEvent.STORAGE_CHANGED, callback as unknown as WindowServiceDestructor);

            expect( windowAddListener ).toHaveBeenCalledTimes(1);
            // @ts-ignore
            expect( windowAddListener.mock.calls[0][0] ).toBe('storage');

            // @ts-ignore
            const eventCallback = windowAddListener.mock.calls[0][1];
            expect( isFunction(eventCallback) ).toBe(true);

            expect( callback ).not.toHaveBeenCalled();

            eventCallback(storageEventMock);

            expect( callback ).toHaveBeenCalledTimes(1);
            expect( callback.mock.calls[0][0] ).toBe(WindowServiceEvent.STORAGE_CHANGED);
            expect( callback.mock.calls[0][1] ).toStrictEqual(storageEventMock);

            // @ts-ignore
            expect( windowRemoveListener ).not.toHaveBeenCalled();

            listener();
            listener = undefined;

            // @ts-ignore
            expect( windowRemoveListener ).toHaveBeenCalledTimes(1);
            // @ts-ignore
            expect( windowRemoveListener.mock.calls[0][0] ).toBe('storage');
            // @ts-ignore
            expect( windowRemoveListener.mock.calls[0][1] ).toStrictEqual(eventCallback);

        });

    });

    describe('.getColorScheme', () => {

        test('returns LIGHT for light mode', () => {

            const matchMediaResult = {
                matches: false
            };

            windowMatchMediaMock.mockReturnValue(matchMediaResult as unknown as MediaQueryList);

            expect( WindowService.getColorScheme() ).toStrictEqual(ColorScheme.LIGHT);

            expect( windowMatchMediaMock ).toHaveBeenCalledTimes(1);

        });

        test('returns DARK for dark mode', () => {

            const matchMediaResult = {
                matches: true
            };

            windowMatchMediaMock.mockReturnValue(matchMediaResult as unknown as MediaQueryList);

            expect( WindowService.getColorScheme() ).toStrictEqual(ColorScheme.DARK);

            expect( windowMatchMediaMock ).toHaveBeenCalledTimes(1);

        });

        test('returns LIGHT after change event from dark to light', () => {

            expect(listener).toBe(undefined);

            callback = jest.fn();

            const matchMediaResultSpy = {
                matches: true,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn()
            };

            windowMatchMediaMock.mockReturnValue(matchMediaResultSpy as unknown as MediaQueryList);

            listener = WindowService.on(WindowServiceEvent.COLOR_SCHEME_CHANGED, callback as unknown as WindowServiceDestructor);

            expect( windowMatchMediaMock ).toHaveBeenCalledTimes(1);
            expect( windowMatchMediaMock.mock.calls[0][0] ).toBe(DARK_COLOR_SCHEME_QUERY);

            // @ts-ignore
            expect( matchMediaResultSpy.addEventListener ).toHaveBeenCalledTimes(1);
            expect( matchMediaResultSpy.addEventListener.mock.calls[0][0] ).toBe('change');

            const eventCallback = matchMediaResultSpy.addEventListener.mock.calls[0][1];
            expect( isFunction(eventCallback) ).toBe(true);

            expect( WindowService.getColorScheme() ).toBe(ColorScheme.DARK);

            eventCallback({matches: false});

            expect( WindowService.getColorScheme() ).toBe(ColorScheme.LIGHT);

        });

    });

    describe('.isDarkModeEnabled', () => {

        test('returns false for light mode', () => {

            const matchMediaResult = {
                matches: false
            };

            windowMatchMediaMock.mockReturnValue(matchMediaResult as unknown as MediaQueryList);

            expect( WindowService.isDarkModeEnabled() ).toStrictEqual(false);

            expect( windowMatchMediaMock ).toHaveBeenCalledTimes(1);

        });

        test('returns true for dark mode', () => {

            const matchMediaResult = {
                matches: true
            };

            windowMatchMediaMock.mockReturnValue(matchMediaResult as unknown as MediaQueryList);

            expect( WindowService.isDarkModeEnabled() ).toStrictEqual(true);

            expect( windowMatchMediaMock ).toHaveBeenCalledTimes(1);

        });

    });

    describe('.isLightModeEnabled', () => {

        test('returns false for dark mode', () => {

            const matchMediaResult = {
                matches: true
            };

            windowMatchMediaMock.mockReturnValue(matchMediaResult as unknown as MediaQueryList);

            expect( WindowService.isLightModeEnabled() ).toStrictEqual(false);

            expect( windowMatchMediaMock ).toHaveBeenCalledTimes(1);

        });

        test('returns true for light mode', () => {

            const matchMediaResult = {
                matches: false
            };

            windowMatchMediaMock.mockReturnValue(matchMediaResult as unknown as MediaQueryList);

            expect( WindowService.isLightModeEnabled() ).toStrictEqual(true);

            expect( windowMatchMediaMock ).toHaveBeenCalledTimes(1);

        });

    });

});
