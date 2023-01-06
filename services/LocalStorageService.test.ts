// Copyright (c) 2020-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { LocalStorageService, LocalStorageServiceDestructor} from "./LocalStorageService";
import { WindowService, WindowServiceEvent} from "./WindowService";
import {StorageServiceEvent} from "./types/AbtractStorageService";
import { isFunction } from "../../core/types/Function";

describe('LocalStorageService', () => {

    let storeMock : any;
    let windowServiceOnSpy : any;
    let listener : LocalStorageServiceDestructor | undefined;

    beforeAll(() => {

        windowServiceOnSpy = jest.spyOn(WindowService, 'on');

        storeMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            clear: jest.fn(),
            removeItem: jest.fn()
        };

        Object.defineProperty(window, 'localStorage', { value: storeMock });

    });

    afterEach(() => {

        if (listener) {
            listener();
            listener = undefined;
        }

        jest.clearAllMocks();

    });

    describe('.hasItem', () => {

        test('returns true for defined value', () => {
            storeMock.getItem.mockReturnValue(null).mockReturnValueOnce('bar');
            expect( LocalStorageService.hasItem('foo') ).toBe(true);
        });

        test('returns false for non-defined values', () => {
            storeMock.getItem.mockReturnValue(null);
            expect( LocalStorageService.hasItem('foo') ).toBe(false);
        });

    });

    describe('.getItem', () => {

        test('returns the value for defined value', () => {
            storeMock.getItem.mockReturnValue(null).mockReturnValueOnce('bar');
            expect( LocalStorageService.getItem('foo') ).toBe('bar');
        });

        test('returns null for non-defined values', () => {
            storeMock.getItem.mockReturnValue(null);
            expect( LocalStorageService.getItem('foo') ).toBeNull();
        });

    });

    describe('.removeItem', () => {

        test('calls window.localStorage.removeItem', () => {
            expect( storeMock.removeItem ).not.toHaveBeenCalled();
            LocalStorageService.removeItem('foo');
            expect( storeMock.removeItem ).toHaveBeenCalledTimes(1);
        });

        test('returns itself for chaining', () => {
            expect( LocalStorageService.removeItem('foo') ).toBe(LocalStorageService);
        });

    });

    describe('.setItem', () => {

        test('calls window.localStorage.setItem', () => {

            expect( storeMock.setItem ).not.toHaveBeenCalled();
            LocalStorageService.setItem('foo', 'bar');
            expect( storeMock.setItem ).toHaveBeenCalledTimes(1);
            expect( storeMock.setItem.mock.calls[0][0] ).toBe('foo');
            expect( storeMock.setItem.mock.calls[0][1] ).toBe('bar');

        });

        test('returns itself for chaining', () => {
            expect( LocalStorageService.setItem('foo', 'bar') ).toBe(LocalStorageService);
        });

    });

    describe('.removeAllItems', () => {

        test('calls window.localStorage.clear()', () => {
            expect( storeMock.clear ).not.toHaveBeenCalled();
            LocalStorageService.removeAllItems();
            expect( storeMock.clear ).toHaveBeenCalledTimes(1);
        });

        test('returns itself for chaining', () => {
            expect( LocalStorageService.removeAllItems() ).toBe(LocalStorageService);
        });

    });

    describe('.Event', () => {
        test('is StorageServiceEvent', () => {
            expect( LocalStorageService.Event ).toBe(StorageServiceEvent);
        });
    });

    describe('.on', () => {


        test('can listen PROPERTY_CHANGED event when property is modified', () => {

            const storageEventMock : Partial<StorageEvent> = {
                key: 'foo',
                newValue: 'hello',
                oldValue: 'world',
                storageArea: window.localStorage,
                url: 'example.com'
            };

            const callback = jest.fn();

            listener = LocalStorageService.on(LocalStorageService.Event.PROPERTY_CHANGED, callback);

            expect( windowServiceOnSpy ).toHaveBeenCalledTimes(1);

            const eventCallback = windowServiceOnSpy.mock.calls[0][1];

            expect( isFunction(eventCallback) ).toBe(true)

            expect( callback ).not.toHaveBeenCalled();

            eventCallback(WindowServiceEvent.STORAGE_CHANGED, storageEventMock);

            expect( callback ).toHaveBeenCalledTimes(1);
            expect( callback.mock.calls[0][0] ).toBe(LocalStorageService.Event.PROPERTY_CHANGED);
            expect( callback.mock.calls[0][1] ).toBe('foo');

        });

        test('can listen PROPERTY_CHANGED event when property is created', () => {

            const storageEventMock : Partial<StorageEvent> = {
                key: 'foo',
                newValue: 'hello',
                oldValue: null,
                storageArea: window.localStorage,
                url: 'example.com'
            };

            const callback = jest.fn();

            listener = LocalStorageService.on(LocalStorageService.Event.PROPERTY_CHANGED, callback);

            expect( windowServiceOnSpy ).toHaveBeenCalledTimes(1);

            const eventCallback = windowServiceOnSpy.mock.calls[0][1];

            expect( isFunction(eventCallback) ).toBe(true)

            expect( callback ).not.toHaveBeenCalled();

            eventCallback(WindowServiceEvent.STORAGE_CHANGED, storageEventMock);

            expect( callback ).toHaveBeenCalledTimes(1);
            expect( callback.mock.calls[0][0] ).toBe(LocalStorageService.Event.PROPERTY_CHANGED);
            expect( callback.mock.calls[0][1] ).toBe('foo');

        });

        test('can listen PROPERTY_CHANGED event when property is deleted', () => {

            const storageEventMock : Partial<StorageEvent> = {
                key: 'foo',
                newValue: null,
                oldValue: 'hello',
                storageArea: window.localStorage,
                url: 'example.com'
            };

            const callback = jest.fn();

            listener = LocalStorageService.on(LocalStorageService.Event.PROPERTY_CHANGED, callback);

            expect( windowServiceOnSpy ).toHaveBeenCalledTimes(1);

            const eventCallback = windowServiceOnSpy.mock.calls[0][1];

            expect( isFunction(eventCallback) ).toBe(true)

            expect( callback ).not.toHaveBeenCalled();

            eventCallback(WindowServiceEvent.STORAGE_CHANGED, storageEventMock);

            expect( callback ).toHaveBeenCalledTimes(1);
            expect( callback.mock.calls[0][0] ).toBe(LocalStorageService.Event.PROPERTY_CHANGED);
            expect( callback.mock.calls[0][1] ).toBe('foo');

        });

        test('cannot listen PROPERTY_CHANGED event when all properties are cleared', () => {

            const storageEventMock : Partial<StorageEvent> = {
                key: null,
                newValue: null,
                oldValue: null,
                storageArea: window.localStorage,
                url: 'example.com'
            };

            const callback = jest.fn();

            listener = LocalStorageService.on(LocalStorageService.Event.PROPERTY_CHANGED, callback);

            expect( windowServiceOnSpy ).toHaveBeenCalledTimes(1);

            const eventCallback = windowServiceOnSpy.mock.calls[0][1];

            expect( isFunction(eventCallback) ).toBe(true)

            expect( callback ).not.toHaveBeenCalled();

            eventCallback(WindowServiceEvent.STORAGE_CHANGED, storageEventMock);

            expect( callback ).not.toHaveBeenCalled();

        });


        test('can listen PROPERTY_MODIFIED event when property is modified', () => {

            const storageEventMock : Partial<StorageEvent> = {
                key: 'foo',
                newValue: 'hello',
                oldValue: 'world',
                storageArea: window.localStorage,
                url: 'example.com'
            };

            const callback = jest.fn();

            listener = LocalStorageService.on(LocalStorageService.Event.PROPERTY_MODIFIED, callback);

            expect( windowServiceOnSpy ).toHaveBeenCalledTimes(1);

            const eventCallback = windowServiceOnSpy.mock.calls[0][1];

            expect( isFunction(eventCallback) ).toBe(true)

            expect( callback ).not.toHaveBeenCalled();

            eventCallback(WindowServiceEvent.STORAGE_CHANGED, storageEventMock);

            expect( callback ).toHaveBeenCalledTimes(1);
            expect( callback.mock.calls[0][0] ).toBe(LocalStorageService.Event.PROPERTY_MODIFIED);
            expect( callback.mock.calls[0][1] ).toBe('foo');

        });

        test('cannot listen PROPERTY_MODIFIED event when property is deleted', () => {

            const storageEventMock : Partial<StorageEvent> = {
                key: 'foo',
                newValue: null,
                oldValue: 'world',
                storageArea: window.localStorage,
                url: 'example.com'
            };

            const callback = jest.fn();

            listener = LocalStorageService.on(LocalStorageService.Event.PROPERTY_MODIFIED, callback);

            expect( windowServiceOnSpy ).toHaveBeenCalledTimes(1);

            const eventCallback = windowServiceOnSpy.mock.calls[0][1];

            expect( isFunction(eventCallback) ).toBe(true)

            expect( callback ).not.toHaveBeenCalled();

            eventCallback(WindowServiceEvent.STORAGE_CHANGED, storageEventMock);

            expect( callback ).not.toHaveBeenCalled();

        });

        test('cannot listen PROPERTY_MODIFIED event when property is created', () => {

            const storageEventMock : Partial<StorageEvent> = {
                key: 'foo',
                newValue: 'hello',
                oldValue: null,
                storageArea: window.localStorage,
                url: 'example.com'
            };

            const callback = jest.fn();

            listener = LocalStorageService.on(LocalStorageService.Event.PROPERTY_MODIFIED, callback);

            expect( windowServiceOnSpy ).toHaveBeenCalledTimes(1);

            const eventCallback = windowServiceOnSpy.mock.calls[0][1];

            expect( isFunction(eventCallback) ).toBe(true)

            expect( callback ).not.toHaveBeenCalled();

            eventCallback(WindowServiceEvent.STORAGE_CHANGED, storageEventMock);

            expect( callback ).not.toHaveBeenCalled();

        });

        test('cannot listen PROPERTY_MODIFIED event when all properties are cleared', () => {

            const storageEventMock : Partial<StorageEvent> = {
                key: null,
                newValue: null,
                oldValue: null,
                storageArea: window.localStorage,
                url: 'example.com'
            };

            const callback = jest.fn();

            listener = LocalStorageService.on(LocalStorageService.Event.PROPERTY_MODIFIED, callback);

            expect( windowServiceOnSpy ).toHaveBeenCalledTimes(1);

            const eventCallback = windowServiceOnSpy.mock.calls[0][1];

            expect( isFunction(eventCallback) ).toBe(true)

            expect( callback ).not.toHaveBeenCalled();

            eventCallback(WindowServiceEvent.STORAGE_CHANGED, storageEventMock);

            expect( callback ).not.toHaveBeenCalled();

        });



        test('can listen PROPERTY_DELETED event when property is deleted', () => {

            const storageEventMock : Partial<StorageEvent> = {
                key: 'foo',
                newValue: null,
                oldValue: 'world',
                storageArea: window.localStorage,
                url: 'example.com'
            };

            const callback = jest.fn();

            listener = LocalStorageService.on(LocalStorageService.Event.PROPERTY_DELETED, callback);

            expect( windowServiceOnSpy ).toHaveBeenCalledTimes(1);

            const eventCallback = windowServiceOnSpy.mock.calls[0][1];

            expect( isFunction(eventCallback) ).toBe(true)

            expect( callback ).not.toHaveBeenCalled();

            eventCallback(WindowServiceEvent.STORAGE_CHANGED, storageEventMock);

            expect( callback ).toHaveBeenCalledTimes(1);
            expect( callback.mock.calls[0][0] ).toBe(LocalStorageService.Event.PROPERTY_DELETED);
            expect( callback.mock.calls[0][1] ).toBe('foo');

        });

        test('cannot listen PROPERTY_DELETED event when property is modified', () => {

            const storageEventMock : Partial<StorageEvent> = {
                key: 'foo',
                newValue: 'hello',
                oldValue: 'world',
                storageArea: window.localStorage,
                url: 'example.com'
            };

            const callback = jest.fn();

            listener = LocalStorageService.on(LocalStorageService.Event.PROPERTY_DELETED, callback);

            expect( windowServiceOnSpy ).toHaveBeenCalledTimes(1);

            const eventCallback = windowServiceOnSpy.mock.calls[0][1];

            expect( isFunction(eventCallback) ).toBe(true)

            expect( callback ).not.toHaveBeenCalled();

            eventCallback(WindowServiceEvent.STORAGE_CHANGED, storageEventMock);

            expect( callback ).not.toHaveBeenCalled();

        });

        test('cannot listen PROPERTY_DELETED event when property is created', () => {

            const storageEventMock : Partial<StorageEvent> = {
                key: 'foo',
                newValue: 'hello',
                oldValue: null,
                storageArea: window.localStorage,
                url: 'example.com'
            };

            const callback = jest.fn();

            listener = LocalStorageService.on(LocalStorageService.Event.PROPERTY_DELETED, callback);

            expect( windowServiceOnSpy ).toHaveBeenCalledTimes(1);

            const eventCallback = windowServiceOnSpy.mock.calls[0][1];

            expect( isFunction(eventCallback) ).toBe(true)

            expect( callback ).not.toHaveBeenCalled();

            eventCallback(WindowServiceEvent.STORAGE_CHANGED, storageEventMock);

            expect( callback ).not.toHaveBeenCalled();

        });

        test('cannot listen PROPERTY_DELETED event when all properties are cleared', () => {

            const storageEventMock : Partial<StorageEvent> = {
                key: null,
                newValue: null,
                oldValue: null,
                storageArea: window.localStorage,
                url: 'example.com'
            };

            const callback = jest.fn();

            listener = LocalStorageService.on(LocalStorageService.Event.PROPERTY_DELETED, callback);

            expect( windowServiceOnSpy ).toHaveBeenCalledTimes(1);

            const eventCallback = windowServiceOnSpy.mock.calls[0][1];

            expect( isFunction(eventCallback) ).toBe(true)

            expect( callback ).not.toHaveBeenCalled();

            eventCallback(WindowServiceEvent.STORAGE_CHANGED, storageEventMock);

            expect( callback ).not.toHaveBeenCalled();

        });


        test('can listen CLEAR event when all properties are cleared', () => {

            const storageEventMock : Partial<StorageEvent> = {
                key: null,
                newValue: null,
                oldValue: null,
                storageArea: window.localStorage,
                url: 'example.com'
            };

            const callback = jest.fn();

            listener = LocalStorageService.on(LocalStorageService.Event.CLEAR, callback);

            expect( windowServiceOnSpy ).toHaveBeenCalledTimes(1);

            const eventCallback = windowServiceOnSpy.mock.calls[0][1];

            expect( isFunction(eventCallback) ).toBe(true)

            expect( callback ).not.toHaveBeenCalled();

            eventCallback(WindowServiceEvent.STORAGE_CHANGED, storageEventMock);

            expect( callback ).toHaveBeenCalledTimes(1);
            expect( callback.mock.calls[0][0] ).toBe(LocalStorageService.Event.CLEAR);

        });

        test('cannot listen CLEAR event when single property is deleted', () => {

            const storageEventMock : Partial<StorageEvent> = {
                key: 'foo',
                newValue: null,
                oldValue: 'hello',
                storageArea: window.localStorage,
                url: 'example.com'
            };

            const callback = jest.fn();

            listener = LocalStorageService.on(LocalStorageService.Event.CLEAR, callback);

            expect( windowServiceOnSpy ).toHaveBeenCalledTimes(1);

            const eventCallback = windowServiceOnSpy.mock.calls[0][1];

            expect( isFunction(eventCallback) ).toBe(true)

            expect( callback ).not.toHaveBeenCalled();

            eventCallback(WindowServiceEvent.STORAGE_CHANGED, storageEventMock);

            expect( callback ).not.toHaveBeenCalled();

        });

        test('cannot listen CLEAR event when single property is modified', () => {

            const storageEventMock : Partial<StorageEvent> = {
                key: 'foo',
                newValue: 'world',
                oldValue: 'hello',
                storageArea: window.localStorage,
                url: 'example.com'
            };

            const callback = jest.fn();

            listener = LocalStorageService.on(LocalStorageService.Event.CLEAR, callback);

            expect( windowServiceOnSpy ).toHaveBeenCalledTimes(1);

            const eventCallback = windowServiceOnSpy.mock.calls[0][1];

            expect( isFunction(eventCallback) ).toBe(true)

            expect( callback ).not.toHaveBeenCalled();

            eventCallback(WindowServiceEvent.STORAGE_CHANGED, storageEventMock);

            expect( callback ).not.toHaveBeenCalled();

        });

        test('cannot listen CLEAR event when single property is created', () => {

            const storageEventMock : Partial<StorageEvent> = {
                key: 'foo',
                newValue: 'hello',
                oldValue: null,
                storageArea: window.localStorage,
                url: 'example.com'
            };

            const callback = jest.fn();

            listener = LocalStorageService.on(LocalStorageService.Event.CLEAR, callback);

            expect( windowServiceOnSpy ).toHaveBeenCalledTimes(1);

            const eventCallback = windowServiceOnSpy.mock.calls[0][1];

            expect( isFunction(eventCallback) ).toBe(true)

            expect( callback ).not.toHaveBeenCalled();

            eventCallback(WindowServiceEvent.STORAGE_CHANGED, storageEventMock);

            expect( callback ).not.toHaveBeenCalled();

        });


    });

});
