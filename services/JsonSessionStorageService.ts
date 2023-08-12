// Copyright (c) 2020-2021. Sendanor <info@sendanor.fi>. All rights reserved.

//import { LogService } from "../../core/LogService";
import { JsonAny } from "../../core/Json";

import { SessionStorageService, SessionStorageServiceDestructor} from "./SessionStorageService";
import {
    StorageServiceChangedEventCallback, StorageServiceClearEventCallback,
    StorageServiceCreatedEventCallback,
    StorageServiceDeletedEventCallback,
    StorageServiceEvent, StorageServiceModifiedEventCallback
} from "./types/AbtractStorageService";
import {ObserverDestructor} from "../../core/Observer";

//const LOG = LogService.createLogger('JsonSessionStorageService');

export class JsonSessionStorageService {

    public static Event = SessionStorageService.Event;

    public static on (name : StorageServiceEvent.PROPERTY_DELETED , callback : StorageServiceDeletedEventCallback)  : ObserverDestructor;
    public static on (name : StorageServiceEvent.PROPERTY_CREATED , callback : StorageServiceCreatedEventCallback)  : ObserverDestructor;
    public static on (name : StorageServiceEvent.PROPERTY_MODIFIED, callback : StorageServiceModifiedEventCallback) : ObserverDestructor;
    public static on (name : StorageServiceEvent.PROPERTY_CHANGED , callback : StorageServiceChangedEventCallback)  : ObserverDestructor;
    public static on (name : StorageServiceEvent.CLEAR            , callback : StorageServiceClearEventCallback)    : ObserverDestructor;

    /**
     * This is just a wrapper for SessionStorageService.on(name, callback)
     *
     * @param name
     * @param callback
     */
    public static on (
        name     : StorageServiceEvent.PROPERTY_DELETED
                 | StorageServiceEvent.PROPERTY_CREATED
                 | StorageServiceEvent.PROPERTY_MODIFIED
                 | StorageServiceEvent.PROPERTY_CHANGED
                 | StorageServiceEvent.CLEAR ,
        callback : StorageServiceDeletedEventCallback
                 | StorageServiceCreatedEventCallback
                 | StorageServiceModifiedEventCallback
                 | StorageServiceChangedEventCallback
                 | StorageServiceClearEventCallback
    ) : SessionStorageServiceDestructor {
        return SessionStorageService.on(name as any, callback as any);
    }

    public static hasItem (key : string) : boolean {
        return SessionStorageService.hasItem(key);
    }

    public static getItem (key : string) : JsonAny | null {
        const valueString = SessionStorageService.getItem(key);
        return valueString === null ? null : JSON.parse(valueString);
    }

    public static removeItem (key : string) : JsonSessionStorageService {
        SessionStorageService.removeItem(key);
        return this;
    }

    public static setItem (key : string, value: JsonAny) : JsonSessionStorageService {
        const valueString = JSON.stringify(value);
        SessionStorageService.setItem(key, valueString);
        return this;
    }

    public static removeAllItems () : JsonSessionStorageService {
        SessionStorageService.removeAllItems();
        return this;
    }

}


