// Copyright (c) 2020-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { Observer, ObserverDestructor} from "../../../core/Observer";

export enum StorageServiceEvent {

    /**
     * Called for any type: created, deleted, or modified
     */
    PROPERTY_CHANGED  = "StorageService:propertyChanged",

    /**
     * Only called when property is created
     */
    PROPERTY_CREATED  = "StorageService:propertyCreated",

    /**
     * Only called when property is deleted
     */
    PROPERTY_DELETED  = "StorageService:propertyDeleted",

    /**
     * Only called when property is modified
     */
    PROPERTY_MODIFIED = "StorageService:propertyModified",

    /** Called when every property has been removed */
    CLEAR             = "StorageService:clear",

}

export function isStorageServiceEvent (value : any) : value is StorageServiceEvent {

    switch (value) {
        case StorageServiceEvent.PROPERTY_CHANGED:
        case StorageServiceEvent.PROPERTY_CREATED:
        case StorageServiceEvent.PROPERTY_DELETED:
        case StorageServiceEvent.PROPERTY_MODIFIED:
        case StorageServiceEvent.CLEAR:
            return true;

        default:
            return false;

    }
}

export type StorageServiceChangedEventCallback  = (name: StorageServiceEvent.PROPERTY_CHANGED, key: string) => void;
export type StorageServiceCreatedEventCallback  = (name: StorageServiceEvent.PROPERTY_CREATED, key: string) => void;
export type StorageServiceDeletedEventCallback  = (name: StorageServiceEvent.PROPERTY_DELETED, key: string) => void;
export type StorageServiceModifiedEventCallback = (name: StorageServiceEvent.PROPERTY_MODIFIED, key: string) => void;
export type StorageServiceClearEventCallback    = (name: StorageServiceEvent.CLEAR) => void;

export interface StorageObject {
    getItem(key: string) : string | null;
    setItem(key: string, value: string) : void;
    removeItem(key: string) : void;
    clear() : void;
}

export abstract class AbstractStorageService {

    public static Event = StorageServiceEvent;

    protected static _getObserver () : Observer<StorageServiceEvent> {
        throw new Error('Must be implemented: _getObserver');
    }

    protected static _getStorage () : StorageObject | undefined {
        throw new Error('Must be implemented: _getStorage');
    }

    protected static _onStorageEventObject (event: StorageEvent) {
        if (event.storageArea === this._getStorage()) {
            this._onStorageEvent(event.key, event.newValue, event.oldValue);
        }
    }

    protected static _onStorageEvent (
        key      : string | null,
        value    : string | null,
        oldValue : string | null
    ) {

        const observer = this._getObserver();

        if (key === null) {
            if (observer.hasCallbacks(StorageServiceEvent.CLEAR)) {
                observer.triggerEvent(StorageServiceEvent.CLEAR);
            }
            return;
        }

        if (value === null) {
            if (observer.hasCallbacks(StorageServiceEvent.PROPERTY_DELETED)) {
                observer.triggerEvent(StorageServiceEvent.PROPERTY_DELETED, key);
            }
        } else if (oldValue === null) {
            if (observer.hasCallbacks(StorageServiceEvent.PROPERTY_CREATED)) {
                observer.triggerEvent(StorageServiceEvent.PROPERTY_CREATED, key);
            }
        } else {
            if (observer.hasCallbacks(StorageServiceEvent.PROPERTY_MODIFIED)) {
                observer.triggerEvent(StorageServiceEvent.PROPERTY_MODIFIED, key);
            }
        }

        if (observer.hasCallbacks(StorageServiceEvent.PROPERTY_CHANGED)) {
            observer.triggerEvent(StorageServiceEvent.PROPERTY_CHANGED, key);
        }

    }


    public static on (name : StorageServiceEvent.PROPERTY_DELETED , callback : StorageServiceDeletedEventCallback)  : ObserverDestructor;
    public static on (name : StorageServiceEvent.PROPERTY_CREATED , callback : StorageServiceCreatedEventCallback)  : ObserverDestructor;
    public static on (name : StorageServiceEvent.PROPERTY_MODIFIED, callback : StorageServiceModifiedEventCallback) : ObserverDestructor;
    public static on (name : StorageServiceEvent.PROPERTY_CHANGED , callback : StorageServiceChangedEventCallback)  : ObserverDestructor;
    public static on (name : StorageServiceEvent.CLEAR            , callback : StorageServiceClearEventCallback)    : ObserverDestructor;

    public static on (
        name     : (
              StorageServiceEvent.PROPERTY_DELETED
            | StorageServiceEvent.PROPERTY_CREATED
            | StorageServiceEvent.PROPERTY_MODIFIED
            | StorageServiceEvent.PROPERTY_CHANGED
            | StorageServiceEvent.CLEAR
            ),
        callback : (
              StorageServiceDeletedEventCallback
            | StorageServiceCreatedEventCallback
            | StorageServiceModifiedEventCallback
            | StorageServiceChangedEventCallback
            | StorageServiceClearEventCallback
            )
    ) : ObserverDestructor {
        throw new Error('Must be implemented');
    }

    public static hasItem (key : string) : boolean {
        const storage = this._getStorage();
        if (storage) {
            return storage.getItem(key) !== null;
        } else {
            return false;
        }
    }

    public static getItem (key : string) : string | null {
        const storage = this._getStorage();
        if (storage) {
            return storage.getItem(key);
        } else {
            return null;
        }
    }

    public static removeItem (key : string) : typeof AbstractStorageService {
        const storage = this._getStorage();
        if (storage) storage.removeItem(key);
        return this;
    }

    public static setItem (key : string, value: string) : typeof AbstractStorageService {
        const storage = this._getStorage();
        if (storage) storage.setItem(key, value);
        return this;
    }

    public static removeAllItems () : typeof AbstractStorageService {
        const storage = this._getStorage();
        if (storage) storage.clear();
        return this;
    }

    protected static _getWindow () : any | undefined {
        return typeof window !== 'undefined' ? window : undefined;
    }

}


