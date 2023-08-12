// Copyright (c) 2021-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {ColorScheme, parseColorScheme, stringifyColorScheme} from "../../core/style/types/ColorScheme";
import { LocalStorageService } from "./LocalStorageService";
import { Observer, ObserverDestructor} from "../../core/Observer";
import {WindowServiceDestructor} from "./WindowService";
import { LogService } from "../../core/LogService";
import { parseStyleScheme, stringifyStyleScheme, StyleScheme } from "../types/StyleScheme";

const LOG = LogService.createLogger('ThemeLocalStorageService');

export enum ThemeLocalStorageServiceEvent {
    COLOR_SCHEME_CHANGED = "ThemeLocalStorageService:colorSchemeChanged"
}

export type ThemeLocalStorageServiceColorSchemeChangedEventCallback = (name: ThemeLocalStorageServiceEvent.COLOR_SCHEME_CHANGED) => void;

export const COLOR_SCHEME_LOCAL_STORAGE_KEY = 'fi.nor.colorScheme';
export const STYLE_SCHEME_LOCAL_STORAGE_KEY = 'fi.nor.ui.style';

export type ThemeLocalStorageServiceDestructor = ObserverDestructor;

/**
 * This service exposes API to control user defined theme setting stored in local storage
 */
export class ThemeLocalStorageService {

    private static _observer                : Observer<ThemeLocalStorageServiceEvent> = new Observer<ThemeLocalStorageServiceEvent>("ThemeLocalStorageService");
    private static _propertyChangedListener : WindowServiceDestructor | undefined;
    private static _propertyClearedListener : WindowServiceDestructor | undefined;


    public static Event = ThemeLocalStorageServiceEvent;

    public static getColorScheme () : ColorScheme | undefined {
        const value : string | null = LocalStorageService.getItem(COLOR_SCHEME_LOCAL_STORAGE_KEY);
        if (!value) return undefined;
        return parseColorScheme(value);
    }

    public static setColorScheme (value : ColorScheme | undefined) : ThemeLocalStorageService {

        if (value === undefined) {
            if (LocalStorageService.hasItem(COLOR_SCHEME_LOCAL_STORAGE_KEY)) {
                LocalStorageService.removeItem(COLOR_SCHEME_LOCAL_STORAGE_KEY);
            }
        } else {
            LocalStorageService.setItem(COLOR_SCHEME_LOCAL_STORAGE_KEY, stringifyColorScheme(value));
        }

        return this;
    }

    public static getStyleScheme () : StyleScheme | undefined {
        const value : string | null = LocalStorageService.getItem(STYLE_SCHEME_LOCAL_STORAGE_KEY);
        if (!value) return undefined;
        return parseStyleScheme(value);
    }

    public static setStyleScheme (value : StyleScheme | undefined) : ThemeLocalStorageService {

        if (value === undefined) {
            if (LocalStorageService.hasItem(STYLE_SCHEME_LOCAL_STORAGE_KEY)) {
                LocalStorageService.removeItem(STYLE_SCHEME_LOCAL_STORAGE_KEY);
            }
        } else {
            LocalStorageService.setItem(STYLE_SCHEME_LOCAL_STORAGE_KEY, stringifyStyleScheme(value));
        }

        return this;
    }

    public static on (
        name     : ThemeLocalStorageServiceEvent.COLOR_SCHEME_CHANGED,
        callback : ThemeLocalStorageServiceColorSchemeChangedEventCallback
    ) : ThemeLocalStorageServiceDestructor {

        if (name === ThemeLocalStorageServiceEvent.COLOR_SCHEME_CHANGED) {

            if (!this._isWatchingStorageEvent()) {
                this._initializeStorageListener();
            }

            let destructor: any = this._observer.listenEvent(name, callback);

            return () => {
                try {
                    destructor();
                    destructor = undefined;
                } finally {
                    if ( !this._observer.hasCallbacks(ThemeLocalStorageServiceEvent.COLOR_SCHEME_CHANGED) ) {
                        this._unInitializeStorageListener();
                    }
                }
            };

        } else {
            throw new TypeError(`ThemeLocalStorageService: Unsupported event name: ${name}`);
        }

    }


    private static _isWatchingStorageEvent () : boolean {
        return this._propertyChangedListener !== undefined || this._propertyClearedListener !== undefined;
    }

    private static _initializeStorageListener () {

        this._propertyChangedListener = LocalStorageService.on(LocalStorageService.Event.PROPERTY_CHANGED, (
            // @ts-ignore
            event,
            key: string
        ) => {
            if (key === COLOR_SCHEME_LOCAL_STORAGE_KEY) {
                this._onThemeColorSchemeChange();
            }
        });

        this._propertyClearedListener = LocalStorageService.on(LocalStorageService.Event.CLEAR, () => {
            this._onThemeColorSchemeChange();
        });

    }

    private static _unInitializeStorageListener () {

        if (this._propertyChangedListener) {
            this._propertyChangedListener();
            this._propertyChangedListener = undefined;
        }

        if (this._propertyClearedListener) {
            this._propertyClearedListener();
            this._propertyClearedListener = undefined;
        }

    }

    private static _onThemeColorSchemeChange () {
        if (this._observer.hasCallbacks(ThemeLocalStorageServiceEvent.COLOR_SCHEME_CHANGED)) {
            LOG.debug('Color scheme changed in localStorage.');
            this._observer.triggerEvent(ThemeLocalStorageServiceEvent.COLOR_SCHEME_CHANGED);
        } else {
            LOG.warn(`Warning! Listening storage events even though we do not have our own listeners.`);
        }
    }

}


