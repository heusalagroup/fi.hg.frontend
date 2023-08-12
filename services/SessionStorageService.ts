// Copyright (c) 2020-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { AbstractStorageService,
    isStorageServiceEvent,
    StorageObject,
    StorageServiceChangedEventCallback, StorageServiceClearEventCallback,
    StorageServiceCreatedEventCallback,
    StorageServiceDeletedEventCallback,
    StorageServiceEvent,
    StorageServiceModifiedEventCallback
} from "./types/AbtractStorageService";
import { Observer, ObserverCallback, ObserverDestructor} from "../../core/Observer";
import { WindowService, WindowServiceDestructor, WindowServiceEvent} from "./WindowService";
import { WindowObjectService } from "../../core/WindowObjectService";

export type SessionStorageServiceDestructor = ObserverDestructor;

export class SessionStorageService extends AbstractStorageService {

    public static Event = StorageServiceEvent;

    private static _observer        : Observer<StorageServiceEvent> = new Observer<StorageServiceEvent>("SessionStorageService");
    private static _storageListener : WindowServiceDestructor | undefined;

    protected static _getObserver () : Observer<StorageServiceEvent> {
        return this._observer;
    }

    protected static _getStorage () : StorageObject | undefined {
        const w = WindowObjectService.getWindow();
        return w?.sessionStorage;
    }

    public static on (name : StorageServiceEvent.PROPERTY_DELETED , callback : StorageServiceDeletedEventCallback)  : ObserverDestructor;
    public static on (name : StorageServiceEvent.PROPERTY_CREATED , callback : StorageServiceCreatedEventCallback)  : ObserverDestructor;
    public static on (name : StorageServiceEvent.PROPERTY_MODIFIED, callback : StorageServiceModifiedEventCallback) : ObserverDestructor;
    public static on (name : StorageServiceEvent.PROPERTY_CHANGED , callback : StorageServiceChangedEventCallback)  : ObserverDestructor;
    public static on (name : StorageServiceEvent.CLEAR            , callback : StorageServiceClearEventCallback)    : ObserverDestructor;

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
    ) : ObserverDestructor {

        if (isStorageServiceEvent(name)) {

            if (!this._isWatchingStorageEvent()) {
                this._initializeStorageListener();
            }

            let destructor: any = this._observer.listenEvent(name, callback as unknown as ObserverCallback<StorageServiceEvent>);

            return () => {
                try {
                    destructor();
                    destructor = undefined;
                } finally {
                    if (
                        !this._observer.hasCallbacks(StorageServiceEvent.PROPERTY_CHANGED)
                        && !this._observer.hasCallbacks(StorageServiceEvent.PROPERTY_MODIFIED)
                        && !this._observer.hasCallbacks(StorageServiceEvent.PROPERTY_CREATED)
                        && !this._observer.hasCallbacks(StorageServiceEvent.PROPERTY_DELETED)
                        && !this._observer.hasCallbacks(StorageServiceEvent.CLEAR)
                    ) {
                        this._unInitializeStorageListener();
                    }
                }
            };

        } else {
            throw new TypeError(`SessionStorageService: Unsupported event name: ${name}`);
        }

    }

    public static hasItem (key : string) : boolean {
        return super.hasItem(key);
    }

    public static getItem (key : string) : string | null {
        return super.getItem(key);
    }

    public static removeItem (key : string) : typeof SessionStorageService {
        super.removeItem(key);
        return this;
    }

    public static setItem (key : string, value: string) : typeof SessionStorageService {
        super.setItem(key, value);
        return this;
    }

    public static removeAllItems () : typeof SessionStorageService {
        super.removeAllItems();
        return this;
    }


    private static _isWatchingStorageEvent () : boolean {
        return this._storageListener !== undefined;
    }

    private static _initializeStorageListener () {
        this._storageListener = WindowService.on(
            WindowService.Event.STORAGE_CHANGED,
            (
                // @ts-ignore
                eventName : WindowServiceEvent, event: StorageEvent) => this._onStorageEventObject(event)
        );
    }

    private static _unInitializeStorageListener () {
        if (this._storageListener) {
            this._storageListener();
            this._storageListener = undefined;
        }
    }

}


