// Copyright (c) 2021-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { jest } from "@jest/globals";
import { JsonLocalStorageService } from "./JsonLocalStorageService";
import { LocalStorageService } from "./LocalStorageService";
import { StorageServiceEvent } from "./types/AbtractStorageService";

describe('JsonLocalStorageService', () => {

    let storeMock : {
        on             : jest.SpiedFunction<(...args : any) => any>,
        hasItem        : jest.SpiedFunction<(...args : any) => any>,
        getItem        : jest.SpiedFunction<(...args : any) => any>,
        removeItem     : jest.SpiedFunction<(...args : any) => any>,
        setItem        : jest.SpiedFunction<(...args : any) => any>,
        removeAllItems : jest.SpiedFunction<(...args : any) => any>,
    };

    beforeAll(() => {

        storeMock = {
            on             : jest.spyOn(LocalStorageService, 'on'),
            hasItem        : jest.spyOn(LocalStorageService, 'hasItem'),
            getItem        : jest.spyOn(LocalStorageService, 'getItem'),
            removeItem     : jest.spyOn(LocalStorageService, 'removeItem'),
            setItem        : jest.spyOn(LocalStorageService, 'setItem'),
            removeAllItems : jest.spyOn(LocalStorageService, 'removeAllItems')
        };

    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('.hasItem', () => {

        test('returns true for defined value', () => {
            storeMock.hasItem.mockReturnValue(false).mockReturnValueOnce(true);
            expect( JsonLocalStorageService.hasItem('foo') ).toBe(true);
        });

        test('returns false for non-defined values', () => {
            storeMock.hasItem.mockReturnValue(false);
            expect( JsonLocalStorageService.hasItem('foo') ).toBe(false);
        });

    });

    describe('.getItem', () => {

        test('returns the parsed value for defined JSON value', () => {
            storeMock.getItem.mockReturnValue(null).mockReturnValueOnce('"bar"');
            expect( JsonLocalStorageService.getItem('foo') ).toBe('bar');
        });

        test('returns null for non-defined values', () => {
            storeMock.getItem.mockReturnValue(null);
            expect( JsonLocalStorageService.getItem('foo') ).toBeNull();
        });

    });

    describe('.removeItem', () => {

        test('calls window.localStorage.removeItem', () => {
            expect( storeMock.removeItem ).not.toHaveBeenCalled();
            JsonLocalStorageService.removeItem('foo');
            expect( storeMock.removeItem ).toHaveBeenCalledTimes(1);
        });

        test('returns itself for chaining', () => {
            expect( JsonLocalStorageService.removeItem('foo') ).toBe(JsonLocalStorageService);
        });

    });

    describe('.setItem', () => {

        test('calls window.localStorage.setItem', () => {

            expect( storeMock.setItem ).not.toHaveBeenCalled();
            JsonLocalStorageService.setItem('foo', 'bar');
            expect( storeMock.setItem ).toHaveBeenCalledTimes(1);
            expect( storeMock.setItem.mock.calls[0][0] ).toBe('foo');
            expect( storeMock.setItem.mock.calls[0][1] ).toBe('"bar"');

        });

        test('returns itself for chaining', () => {
            expect( JsonLocalStorageService.setItem('foo', 'bar') ).toBe(JsonLocalStorageService);
        });

    });

    describe('.removeAllItems', () => {

        test('calls window.localStorage.clear()', () => {
            expect( storeMock.removeAllItems ).not.toHaveBeenCalled();
            JsonLocalStorageService.removeAllItems();
            expect( storeMock.removeAllItems ).toHaveBeenCalledTimes(1);
        });

        test('returns itself for chaining', () => {
            expect( JsonLocalStorageService.removeAllItems() ).toBe(JsonLocalStorageService);
        });

    });

    describe('.Event', () => {
        test('is StorageServiceEvent', () => {
            expect( JsonLocalStorageService.Event ).toBe(StorageServiceEvent);
        });
    });

    describe('.on', () => {

        test('is wrapper for LocalStorageService.on()', () => {

            expect(storeMock.on).not.toHaveBeenCalled();

            const callback = jest.fn();

            JsonLocalStorageService.on(JsonLocalStorageService.Event.PROPERTY_DELETED, callback);

            expect(storeMock.on).toHaveBeenCalledTimes(1);
            expect(storeMock.on).toHaveBeenCalledWith(JsonLocalStorageService.Event.PROPERTY_DELETED, callback);

        });

    })

});
