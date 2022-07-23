// Copyright (c) 2021-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { ThemeService,
    ThemeServiceColorSchemeChangedEventCallback,
    ThemeServiceDestructor,
    ThemeServiceEvent,
    ThemeServiceMessageType
} from "./ThemeService";
import {ColorScheme} from "../../core/style/types/ColorScheme";
import { WindowService,
    WindowServiceColorSchemeChangedEventCallback,
    WindowServiceDestructor,
    WindowServiceEvent
} from "./WindowService";
import { LogService } from "../../core/LogService";
import {isFunction} from "../../core/modules/lodash";
import { ThemeLocalStorageService,
    ThemeLocalStorageServiceColorSchemeChangedEventCallback,
    ThemeLocalStorageServiceEvent
} from "./ThemeLocalStorageService";
import { WindowEventService,
    WindowEventServiceEvent,
    WindowEventServiceJsonMessageEventCallback
} from "./WindowEventService";
import SpyInstance = jest.SpyInstance;
import { LogLevel } from "../../core/types/LogLevel";

describe('ThemeService', () => {

    let callback : SpyInstance | undefined;
    let listener : WindowServiceDestructor | undefined;

    let windowEventService_on_spy                   = jest.spyOn(WindowEventService, 'on');

    let themeLocalStorageService_getColorScheme_spy = jest.spyOn(ThemeLocalStorageService, 'getColorScheme');
    let themeLocalStorageService_setColorScheme_spy = jest.spyOn(ThemeLocalStorageService, 'setColorScheme');
    let themeLocalStorageService_on_spy             = jest.spyOn(ThemeLocalStorageService, 'on');

    let windowService_getColorScheme_spy            = jest.spyOn(WindowService, 'getColorScheme');
    let windowService_on_spy                        = jest.spyOn(WindowService, 'on');

    beforeAll( () => {

        LogService.setLogLevel(LogLevel.WARN);

        // Object.defineProperty(window, 'matchMedia', {
        //     writable: true,
        //     value: windowMatchMediaMock
        // });

    });

    afterEach(() => {

        if (listener) {
            listener();
            listener = undefined;
        }

        ThemeService.destroy();
        WindowService.destroy();

        jest.clearAllMocks();

    });

    describe('.Event', () => {
        test('is ThemeServiceEvent', () => {
            expect(ThemeService.Event).toStrictEqual(ThemeServiceEvent);
        });
    });

    describe('.setColorScheme', () => {

        test('can change color scheme from LIGHT to DARK', () => {

            ThemeService.setColorScheme(ColorScheme.LIGHT);
            expect( ThemeService.getColorScheme() ).toBe(ColorScheme.LIGHT);
            ThemeService.setColorScheme(ColorScheme.DARK);
            expect( ThemeService.getColorScheme() ).toBe(ColorScheme.DARK);

        });

        test('can change color scheme from DARK to LIGHT', () => {
            ThemeService.setColorScheme(ColorScheme.DARK);
            expect( ThemeService.getColorScheme() ).toBe(ColorScheme.DARK);
            ThemeService.setColorScheme(ColorScheme.LIGHT);
            expect( ThemeService.getColorScheme() ).toBe(ColorScheme.LIGHT);
        });

        test('does not trigger event callback if color schema did not change', () => {

            themeLocalStorageService_getColorScheme_spy.mockReturnValue(undefined);
            windowService_getColorScheme_spy.mockReturnValue(ColorScheme.DARK);

            const destructor1 = jest.fn();
            windowService_on_spy.mockReturnValue(destructor1);

            const destructor2 = jest.fn();
            themeLocalStorageService_on_spy.mockReturnValue(destructor2);

            // Setup event listener
            expect(listener).toBe(undefined);
            callback = jest.fn();
            listener = ThemeService.on(ThemeServiceEvent.COLOR_SCHEME_CHANGED, callback as unknown as ThemeServiceDestructor);
            expect( windowService_on_spy ).toHaveBeenCalledTimes(1);

            // Setup initial state as DARK
            ThemeService.setColorScheme(ColorScheme.DARK);
            expect( ThemeService.getColorScheme() ).toBe(ColorScheme.DARK);
            callback.mockClear();

            // Test the subject
            ThemeService.setColorScheme(ColorScheme.DARK);
            expect( callback ).toHaveBeenCalledTimes(0);

        });

        test('triggers event if color schema changes locally', () => {

            themeLocalStorageService_getColorScheme_spy.mockReturnValue(undefined);
            windowService_getColorScheme_spy.mockReturnValue(ColorScheme.DARK);

            const destructor1 = jest.fn();
            windowService_on_spy.mockReturnValue(destructor1);

            const destructor2 = jest.fn();
            themeLocalStorageService_on_spy.mockReturnValue(destructor2);

            // Setup event listener
            expect(listener).toBe(undefined);
            callback = jest.fn();
            listener = ThemeService.on(ThemeServiceEvent.COLOR_SCHEME_CHANGED, callback as unknown as ThemeServiceDestructor);
            expect( windowService_on_spy ).toHaveBeenCalledTimes(1);

            // Setup initial state as DARK
            ThemeService.setColorScheme(ColorScheme.DARK);
            expect( ThemeService.getColorScheme() ).toBe(ColorScheme.DARK);
            callback.mockClear();

            // Test the subject
            ThemeService.setColorScheme(ColorScheme.LIGHT);
            expect( callback ).toHaveBeenCalledTimes(1);

        });

    });

    describe('.setRemoteColorScheme', () => {

        test('can change remote color scheme to LIGHT without origin', () => {

            const mockTarget = { postMessage: jest.fn() };
            ThemeService.setRemoteColorScheme(ColorScheme.LIGHT, mockTarget);

            expect( mockTarget.postMessage ).toHaveBeenCalledWith(
                `{"type":"${ThemeServiceMessageType.COLOR_SCHEME_CHANGED}","value":${ColorScheme.LIGHT}}`,
                '*'
            );

        });

        test('can change remote color scheme to DARK without origin', () => {

            const mockTarget = { postMessage: jest.fn() };
            ThemeService.setRemoteColorScheme(ColorScheme.DARK, mockTarget);

            expect( mockTarget.postMessage ).toHaveBeenCalledWith(
                `{"type":"${ThemeServiceMessageType.COLOR_SCHEME_CHANGED}","value":${ColorScheme.DARK}}`,
                '*'
            );

        });

        test('can change remote color scheme to undefined without origin', () => {

            const mockTarget = { postMessage: jest.fn() };
            ThemeService.setRemoteColorScheme(undefined, mockTarget);

            expect( mockTarget.postMessage ).toHaveBeenCalledWith(
                `{"type":"${ThemeServiceMessageType.COLOR_SCHEME_CHANGED}"}`,
                '*'
            );

        });

        test('can change remote color scheme to LIGHT with origin', () => {

            const mockTarget = { postMessage: jest.fn() };
            ThemeService.setRemoteColorScheme(ColorScheme.LIGHT, mockTarget, 'http://localhost:3000');

            expect( mockTarget.postMessage ).toHaveBeenCalledWith(
                `{"type":"${ThemeServiceMessageType.COLOR_SCHEME_CHANGED}","value":${ColorScheme.LIGHT}}`,
                'http://localhost:3000'
            );

        });

        test('can change remote color scheme to DARK with origin', () => {

            const mockTarget = { postMessage: jest.fn() };
            ThemeService.setRemoteColorScheme(ColorScheme.DARK, mockTarget, 'http://localhost:3000');

            expect( mockTarget.postMessage ).toHaveBeenCalledWith(
                `{"type":"${ThemeServiceMessageType.COLOR_SCHEME_CHANGED}","value":${ColorScheme.DARK}}`,
                'http://localhost:3000'
            );

        });

        test('can change remote color scheme to undefined with origin', () => {

            const mockTarget = { postMessage: jest.fn() };
            ThemeService.setRemoteColorScheme(undefined, mockTarget, 'http://localhost:3000');

            expect( mockTarget.postMessage ).toHaveBeenCalledWith(
                `{"type":"${ThemeServiceMessageType.COLOR_SCHEME_CHANGED}"}`,
                'http://localhost:3000'
            );

        });

    });

    describe('.setRemoteColorScheme', () => {

        test('can remove remote color scheme without origin', () => {

            const mockTarget = { postMessage: jest.fn() };
            ThemeService.unsetRemoteColorScheme(mockTarget);

            expect( mockTarget.postMessage ).toHaveBeenCalledWith(
                `{"type":"${ThemeServiceMessageType.COLOR_SCHEME_CHANGED}"}`,
                '*'
            );

        });

        test('can remove remote color scheme with origin', () => {

            const mockTarget = { postMessage: jest.fn() };
            ThemeService.unsetRemoteColorScheme(mockTarget, 'http://localhost:3000');

            expect( mockTarget.postMessage ).toHaveBeenCalledWith(
                `{"type":"${ThemeServiceMessageType.COLOR_SCHEME_CHANGED}"}`,
                'http://localhost:3000'
            );

        });

    });

    describe('.getColorScheme', () => {

        test('returns DARK from browser color scheme if only defined', () => {
            themeLocalStorageService_getColorScheme_spy.mockReturnValue(undefined);
            windowService_getColorScheme_spy.mockReturnValue(ColorScheme.DARK);
            expect( ThemeService.getColorScheme() ).toStrictEqual(ColorScheme.DARK);
            expect( windowService_getColorScheme_spy ).toHaveBeenCalledTimes(1);
            expect( themeLocalStorageService_getColorScheme_spy ).toHaveBeenCalledTimes(1);
        });

        test('returns LIGHT from browser color scheme if only defined', () => {
            themeLocalStorageService_getColorScheme_spy.mockReturnValue(undefined);
            windowService_getColorScheme_spy.mockReturnValue(ColorScheme.LIGHT);
            expect( ThemeService.getColorScheme() ).toStrictEqual(ColorScheme.LIGHT);
            expect( windowService_getColorScheme_spy ).toHaveBeenCalledTimes(1);
            expect( themeLocalStorageService_getColorScheme_spy ).toHaveBeenCalledTimes(1);
        });

        test('returns LIGHT from localStorage color scheme if defined', () => {
            themeLocalStorageService_getColorScheme_spy.mockReturnValue(ColorScheme.LIGHT);
            windowService_getColorScheme_spy.mockReturnValue(ColorScheme.DARK);
            expect( ThemeService.getColorScheme() ).toStrictEqual(ColorScheme.LIGHT);
            expect( themeLocalStorageService_getColorScheme_spy ).toHaveBeenCalledTimes(1);
            expect( windowService_getColorScheme_spy ).toHaveBeenCalledTimes(0);
        });

        test('returns DARK from localStorage color scheme if defined', () => {
            themeLocalStorageService_getColorScheme_spy.mockReturnValue(ColorScheme.DARK);
            windowService_getColorScheme_spy.mockReturnValue(ColorScheme.LIGHT);
            expect( ThemeService.getColorScheme() ).toStrictEqual(ColorScheme.DARK);
            expect( themeLocalStorageService_getColorScheme_spy ).toHaveBeenCalledTimes(1);
            expect( windowService_getColorScheme_spy ).toHaveBeenCalledTimes(0);
        });

        test('returns LIGHT from internal state', () => {
            themeLocalStorageService_getColorScheme_spy.mockReturnValue(ColorScheme.DARK);
            windowService_getColorScheme_spy.mockReturnValue(ColorScheme.DARK);
            ThemeService.setColorScheme(ColorScheme.LIGHT);
            expect( ThemeService.getColorScheme() ).toStrictEqual(ColorScheme.LIGHT);
            expect( windowService_getColorScheme_spy ).toHaveBeenCalledTimes(0);
        });

        test('returns DARK from internal state', () => {
            themeLocalStorageService_getColorScheme_spy.mockReturnValue(ColorScheme.LIGHT);
            windowService_getColorScheme_spy.mockReturnValue(ColorScheme.LIGHT);
            ThemeService.setColorScheme(ColorScheme.DARK);
            expect( ThemeService.getColorScheme() ).toStrictEqual(ColorScheme.DARK);
            expect( windowService_getColorScheme_spy ).toHaveBeenCalledTimes(0);
        });

    });

    describe('.hasDarkMode', () => {

        test('returns true when browser state has DARK', () => {
            themeLocalStorageService_getColorScheme_spy.mockReturnValue(undefined);
            windowService_getColorScheme_spy.mockReturnValue(ColorScheme.DARK);
            expect( ThemeService.hasDarkMode() ).toStrictEqual(true);
            expect( windowService_getColorScheme_spy ).toHaveBeenCalledTimes(1);
        });

        test('returns false when browser state has LIGHT', () => {
            themeLocalStorageService_getColorScheme_spy.mockReturnValue(undefined);
            windowService_getColorScheme_spy.mockReturnValue(ColorScheme.LIGHT);
            expect( ThemeService.hasDarkMode() ).toStrictEqual(false);
            expect( windowService_getColorScheme_spy ).toHaveBeenCalledTimes(1);
        });

        test('returns true when internal state has DARK', () => {
            themeLocalStorageService_getColorScheme_spy.mockReturnValue(undefined);
            windowService_getColorScheme_spy.mockReturnValue(ColorScheme.LIGHT);
            ThemeService.setColorScheme(ColorScheme.DARK);
            expect( ThemeService.hasDarkMode() ).toStrictEqual(true);
            expect( windowService_getColorScheme_spy ).toHaveBeenCalledTimes(0);
        });

        test('returns false when internal state has LIGHT', () => {
            themeLocalStorageService_getColorScheme_spy.mockReturnValue(undefined);
            windowService_getColorScheme_spy.mockReturnValue(ColorScheme.DARK);
            ThemeService.setColorScheme(ColorScheme.LIGHT);
            expect( ThemeService.hasDarkMode() ).toStrictEqual(false);
            expect( windowService_getColorScheme_spy ).toHaveBeenCalledTimes(0);
        });

    });

    describe('.hasLightMode', () => {

        test('returns false when browser state has DARK', () => {
            themeLocalStorageService_getColorScheme_spy.mockReturnValue(undefined);
            windowService_getColorScheme_spy.mockReturnValue(ColorScheme.DARK);
            expect( ThemeService.hasLightMode() ).toStrictEqual(false);
            expect( windowService_getColorScheme_spy ).toHaveBeenCalledTimes(1);
        });

        test('returns true when browser state has LIGHT', () => {
            themeLocalStorageService_getColorScheme_spy.mockReturnValue(undefined);
            windowService_getColorScheme_spy.mockReturnValue(ColorScheme.LIGHT);
            expect( ThemeService.hasLightMode() ).toStrictEqual(true);
            expect( windowService_getColorScheme_spy ).toHaveBeenCalledTimes(1);
        });

        test('returns true when internal state has LIGHT', () => {
            themeLocalStorageService_getColorScheme_spy.mockReturnValue(undefined);
            windowService_getColorScheme_spy.mockReturnValue(ColorScheme.DARK);
            ThemeService.setColorScheme(ColorScheme.LIGHT);
            expect( ThemeService.hasLightMode() ).toStrictEqual(true);
            expect( windowService_getColorScheme_spy ).toHaveBeenCalledTimes(0);
        });

        test('returns false when internal state has DARK', () => {
            themeLocalStorageService_getColorScheme_spy.mockReturnValue(undefined);
            windowService_getColorScheme_spy.mockReturnValue(ColorScheme.LIGHT);
            ThemeService.setColorScheme(ColorScheme.DARK);
            expect( ThemeService.hasLightMode() ).toStrictEqual(false);
            expect( windowService_getColorScheme_spy ).toHaveBeenCalledTimes(0);
        });

    });

    describe('.on', () => {

        test('triggers event if browsers color schema changes', () => {

            windowService_getColorScheme_spy.mockReturnValue(ColorScheme.LIGHT);

            const destructor1 = jest.fn();
            windowService_on_spy.mockReturnValue(destructor1);

            const destructor2 = jest.fn();
            themeLocalStorageService_on_spy.mockReturnValue(destructor2);

            // Setup event listener
            expect(listener).toBe(undefined);
            expect( windowService_on_spy ).not.toHaveBeenCalled();
            callback = jest.fn();
            listener = ThemeService.on(ThemeServiceEvent.COLOR_SCHEME_CHANGED, callback as unknown as ThemeServiceColorSchemeChangedEventCallback);

            expect( windowService_on_spy ).toHaveBeenCalledTimes(1);
            expect( windowService_on_spy.mock.calls[0][0] ).toBe(WindowServiceEvent.COLOR_SCHEME_CHANGED);
            const eventCallback = windowService_on_spy.mock.calls[0][1];
            expect( isFunction(eventCallback) ).toBe(true);

            callback.mockClear();

            // Test the subject
            windowService_getColorScheme_spy.mockReturnValue(ColorScheme.DARK);
            (eventCallback as unknown as WindowServiceColorSchemeChangedEventCallback)(WindowServiceEvent.COLOR_SCHEME_CHANGED, ColorScheme.DARK);

            expect( callback ).toHaveBeenCalledTimes(1);
            expect( callback ).toHaveBeenCalledWith(ThemeServiceEvent.COLOR_SCHEME_CHANGED, ColorScheme.DARK);

        });

        test('triggers event if localStorage color schema changes', () => {

            windowService_getColorScheme_spy.mockReturnValue(ColorScheme.LIGHT);

            const destructor1 = jest.fn();
            windowService_on_spy.mockReturnValue(destructor1);

            const destructor2 = jest.fn();
            themeLocalStorageService_on_spy.mockReturnValue(destructor2);

            // Setup event listener
            expect( themeLocalStorageService_on_spy ).not.toHaveBeenCalled();
            expect(listener).toBe(undefined);
            callback = jest.fn();
            listener = ThemeService.on(ThemeServiceEvent.COLOR_SCHEME_CHANGED, callback as unknown as ThemeServiceColorSchemeChangedEventCallback);

            expect( themeLocalStorageService_on_spy ).toHaveBeenCalledTimes(1);
            expect( themeLocalStorageService_on_spy.mock.calls[0][0] ).toBe(ThemeLocalStorageServiceEvent.COLOR_SCHEME_CHANGED);
            const eventCallback = themeLocalStorageService_on_spy.mock.calls[0][1];
            expect( isFunction(eventCallback) ).toBe(true);

            callback.mockClear();

            // Test the subject
            windowService_getColorScheme_spy.mockReturnValue(ColorScheme.DARK);

            (eventCallback as unknown as ThemeLocalStorageServiceColorSchemeChangedEventCallback)(ThemeLocalStorageServiceEvent.COLOR_SCHEME_CHANGED);

            expect( callback ).toHaveBeenCalledTimes(1);
            expect( callback ).toHaveBeenCalledWith(ThemeServiceEvent.COLOR_SCHEME_CHANGED, ColorScheme.DARK);

        });

        test('sets color schema if window message event sent with color schema detected', () => {

            windowService_getColorScheme_spy.mockReturnValue(ColorScheme.LIGHT);

            const destructor1 = jest.fn();
            windowService_on_spy.mockReturnValue(destructor1);

            const destructor2 = jest.fn();
            themeLocalStorageService_on_spy.mockReturnValue(destructor2);

            const destructor3 = jest.fn();
            windowEventService_on_spy.mockReturnValue(destructor3);

            // Setup event listener
            expect( windowEventService_on_spy ).not.toHaveBeenCalled();
            expect(listener).toBe(undefined);
            callback = jest.fn();
            listener = ThemeService.on(ThemeServiceEvent.COLOR_SCHEME_CHANGED, callback as unknown as ThemeServiceColorSchemeChangedEventCallback);

            expect( windowEventService_on_spy ).toHaveBeenCalledTimes(1);
            expect( windowEventService_on_spy.mock.calls[0][0] ).toBe(WindowEventServiceEvent.JSON_MESSAGE);
            const eventCallback = windowEventService_on_spy.mock.calls[0][1];
            expect( isFunction(eventCallback) ).toBe(true);

            callback.mockClear();

            // Test the subject

            (eventCallback as unknown as WindowEventServiceJsonMessageEventCallback)(
                WindowEventServiceEvent.JSON_MESSAGE,
                {
                    type: ThemeServiceMessageType.COLOR_SCHEME_CHANGED,
                    value: ColorScheme.DARK
                },
                'unit test origin'
            );

            expect( callback ).toHaveBeenCalledTimes(1);
            expect( callback ).toHaveBeenCalledWith(ThemeServiceEvent.COLOR_SCHEME_CHANGED, ColorScheme.DARK);

            expect( ThemeService.getColorScheme() ).toBe(ColorScheme.DARK);

        });

        test('removes color schema if window message event sent with undefined color schema', () => {

            windowService_getColorScheme_spy.mockReturnValue(ColorScheme.DARK);

            const destructor1 = jest.fn();
            windowService_on_spy.mockReturnValue(destructor1);

            const destructor2 = jest.fn();
            themeLocalStorageService_on_spy.mockReturnValue(destructor2);

            const destructor3 = jest.fn();
            windowEventService_on_spy.mockReturnValue(destructor3);

            // Setup event listener
            expect( windowEventService_on_spy ).not.toHaveBeenCalled();
            expect(listener).toBe(undefined);
            callback = jest.fn();
            listener = ThemeService.on(ThemeServiceEvent.COLOR_SCHEME_CHANGED, callback as unknown as ThemeServiceColorSchemeChangedEventCallback);

            expect( windowEventService_on_spy ).toHaveBeenCalledTimes(1);
            expect( windowEventService_on_spy.mock.calls[0][0] ).toBe(WindowEventServiceEvent.JSON_MESSAGE);
            const eventCallback = windowEventService_on_spy.mock.calls[0][1];
            expect( isFunction(eventCallback) ).toBe(true);

            ThemeService.setColorScheme(ColorScheme.LIGHT);

            expect( ThemeService.getColorScheme() ).toBe(ColorScheme.LIGHT);

            callback.mockClear();

            // Test the subject

            (eventCallback as unknown as WindowEventServiceJsonMessageEventCallback)(
                WindowEventServiceEvent.JSON_MESSAGE,
                {
                    type: ThemeServiceMessageType.COLOR_SCHEME_CHANGED,
                    value: undefined
                },
                'unit test origin'
            );

            expect( callback ).toHaveBeenCalledTimes(1);
            expect( callback ).toHaveBeenCalledWith(ThemeServiceEvent.COLOR_SCHEME_CHANGED, ColorScheme.DARK);

            expect( ThemeService.getColorScheme() ).toBe(ColorScheme.DARK);

        });

    });

});
