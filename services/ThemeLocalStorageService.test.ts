// Copyright (c) 2021-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { ThemeLocalStorageService,
    COLOR_SCHEME_LOCAL_STORAGE_KEY,
    ThemeLocalStorageServiceEvent
} from "./ThemeLocalStorageService";
import {ColorScheme} from "../../core/style/types/ColorScheme";
import { LocalStorageService } from "./LocalStorageService";
import {find, isFunction} from "../../core/modules/lodash";
import { LogService } from "../../core/LogService";
import { LogLevel } from "../../core/types/LogLevel";

describe('ThemeLocalStorageService', () => {

    let localStorageService_on_spy         = jest.spyOn(LocalStorageService, 'on');
    let localStorageService_hasItem_spy    = jest.spyOn(LocalStorageService, 'hasItem');
    let localStorageService_getItem_spy    = jest.spyOn(LocalStorageService, 'getItem');
    let localStorageService_setItem_spy    = jest.spyOn(LocalStorageService, 'setItem');
    let localStorageService_removeItem_spy = jest.spyOn(LocalStorageService, 'removeItem');

    let destructor : any;

    beforeAll(() => {

        LogService.setLogLevel(LogLevel.WARN);

    });

    afterEach( () => {

        if (destructor !== undefined) {
            destructor();
            destructor = undefined;
        }

        jest.clearAllMocks();

    })

    describe('.getColorScheme', () => {

        test('can parse undefined theme from localStorage', () => {
            expect( localStorageService_getItem_spy ).not.toHaveBeenCalled();
            localStorageService_getItem_spy.mockReturnValue(null);
            expect( ThemeLocalStorageService.getColorScheme() ).toBeUndefined();
            expect( localStorageService_getItem_spy ).toHaveBeenCalledTimes(1);
        });

        test('can parse DARK theme from localStorage', () => {
            expect( localStorageService_getItem_spy ).not.toHaveBeenCalled();
            localStorageService_getItem_spy.mockReturnValue("DARK");
            expect( ThemeLocalStorageService.getColorScheme() ).toBe(ColorScheme.DARK);
            expect( localStorageService_getItem_spy ).toHaveBeenCalledTimes(1);
        });

        test('can parse LIGHT theme from localStorage', () => {
            expect( localStorageService_getItem_spy ).not.toHaveBeenCalled();
            localStorageService_getItem_spy.mockReturnValue("LIGHT");
            expect( ThemeLocalStorageService.getColorScheme() ).toBe(ColorScheme.LIGHT);
            expect( localStorageService_getItem_spy ).toHaveBeenCalledTimes(1);
        });

    });

    describe('.setColorScheme', () => {

        test('can set DARK color scheme to localStorage', () => {
            expect( localStorageService_setItem_spy ).not.toHaveBeenCalled();
            ThemeLocalStorageService.setColorScheme(ColorScheme.DARK);
            expect( localStorageService_setItem_spy ).toHaveBeenCalledTimes(1);
            expect( localStorageService_setItem_spy ).toHaveBeenCalledWith(COLOR_SCHEME_LOCAL_STORAGE_KEY, "DARK");
        });

        test('can set LIGHT color scheme to localStorage', () => {
            expect( localStorageService_setItem_spy ).not.toHaveBeenCalled();
            ThemeLocalStorageService.setColorScheme(ColorScheme.LIGHT);
            expect( localStorageService_setItem_spy ).toHaveBeenCalledTimes(1);
            expect( localStorageService_setItem_spy ).toHaveBeenCalledWith(COLOR_SCHEME_LOCAL_STORAGE_KEY, "LIGHT");
        });

        test('can remove LIGHT color scheme from localStorage', () => {

            expect( localStorageService_getItem_spy ).not.toHaveBeenCalled();
            expect( localStorageService_setItem_spy ).not.toHaveBeenCalled();
            expect( localStorageService_hasItem_spy ).not.toHaveBeenCalled();
            expect( localStorageService_removeItem_spy ).not.toHaveBeenCalled();

            localStorageService_hasItem_spy.mockReturnValue(true);
            localStorageService_getItem_spy.mockReturnValue('LIGHT');

            ThemeLocalStorageService.setColorScheme(undefined);

            expect( localStorageService_removeItem_spy ).toHaveBeenCalledTimes(1);
            expect( localStorageService_removeItem_spy ).toHaveBeenCalledWith(COLOR_SCHEME_LOCAL_STORAGE_KEY);

            expect( localStorageService_setItem_spy ).not.toHaveBeenCalled();

        });

        test('can remove DARK color scheme from localStorage', () => {

            expect( localStorageService_getItem_spy ).not.toHaveBeenCalled();
            expect( localStorageService_setItem_spy ).not.toHaveBeenCalled();
            expect( localStorageService_hasItem_spy ).not.toHaveBeenCalled();
            expect( localStorageService_removeItem_spy ).not.toHaveBeenCalled();

            localStorageService_hasItem_spy.mockReturnValue(true);
            localStorageService_getItem_spy.mockReturnValue('DARK');

            ThemeLocalStorageService.setColorScheme(undefined);

            expect( localStorageService_removeItem_spy ).toHaveBeenCalledTimes(1);
            expect( localStorageService_removeItem_spy ).toHaveBeenCalledWith(COLOR_SCHEME_LOCAL_STORAGE_KEY);

            expect( localStorageService_setItem_spy ).not.toHaveBeenCalled();

        });

        test('does not remove color scheme from localStorage if it is not there', () => {

            expect( localStorageService_getItem_spy ).not.toHaveBeenCalled();
            expect( localStorageService_setItem_spy ).not.toHaveBeenCalled();
            expect( localStorageService_hasItem_spy ).not.toHaveBeenCalled();
            expect( localStorageService_removeItem_spy ).not.toHaveBeenCalled();

            localStorageService_hasItem_spy.mockReturnValue(false);
            localStorageService_getItem_spy.mockReturnValue(null);

            ThemeLocalStorageService.setColorScheme(undefined);

            expect( localStorageService_removeItem_spy ).not.toHaveBeenCalled();
            expect( localStorageService_setItem_spy ).not.toHaveBeenCalled();

        });

    });

    describe('.Event', () => {
        test('is ThemeLocalStorageServiceEvent', () => {
            expect(ThemeLocalStorageService.Event).toStrictEqual(ThemeLocalStorageServiceEvent);
        });
    });

    describe('.on', () => {

        test('can receive events from change in LocalStorageService', () => {

            localStorageService_hasItem_spy.mockReturnValue(true);
            localStorageService_getItem_spy.mockReturnValue('DARK');

            const callback = jest.fn();

            expect( localStorageService_on_spy ).not.toHaveBeenCalled();
            destructor = ThemeLocalStorageService.on(ThemeLocalStorageServiceEvent.COLOR_SCHEME_CHANGED, callback);

            expect( localStorageService_on_spy ).toHaveBeenCalled();

            const mockCall : any = find(localStorageService_on_spy.mock.calls, (item : any) : boolean => {
                return item[0] === LocalStorageService.Event.PROPERTY_CHANGED;
            });

            expect( mockCall[0] as any ).toBe(LocalStorageService.Event.PROPERTY_CHANGED);

            const eventCallback = mockCall[1];
            expect(isFunction(eventCallback)).toStrictEqual(true);

            expect( callback ).not.toHaveBeenCalled();

            eventCallback(LocalStorageService.Event.PROPERTY_CHANGED, COLOR_SCHEME_LOCAL_STORAGE_KEY);

            expect( callback ).toHaveBeenCalledTimes(1);
            expect( callback ).toHaveBeenCalledWith(ThemeLocalStorageServiceEvent.COLOR_SCHEME_CHANGED)

        });

        test('can receive events from reset in LocalStorageService', () => {

            localStorageService_hasItem_spy.mockReturnValue(true);
            localStorageService_getItem_spy.mockReturnValue('DARK');

            const callback = jest.fn();

            expect( localStorageService_on_spy ).not.toHaveBeenCalled();
            destructor = ThemeLocalStorageService.on(ThemeLocalStorageServiceEvent.COLOR_SCHEME_CHANGED, callback);

            expect( localStorageService_on_spy ).toHaveBeenCalled();

            const mockCall : any = find(localStorageService_on_spy.mock.calls, (item : any) : boolean => {
                return item[0] === LocalStorageService.Event.CLEAR;
            });

            expect( mockCall[0] as any ).toBe(LocalStorageService.Event.CLEAR);

            const eventCallback = mockCall[1];
            expect(isFunction(eventCallback)).toStrictEqual(true);

            expect( callback ).not.toHaveBeenCalled();

            eventCallback(LocalStorageService.Event.CLEAR);

            expect( callback ).toHaveBeenCalledTimes(1);
            expect( callback ).toHaveBeenCalledWith(ThemeLocalStorageServiceEvent.COLOR_SCHEME_CHANGED)

        });

    });

});
