// Copyright (c) 2021-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { Observer,  ObserverCallback, ObserverDestructor } from "../../core/Observer";
import { LogService } from "../../core/LogService";
import { ColorScheme, stringifyColorScheme } from "../../core/style/types/ColorScheme";
import { stringifyStyleScheme, StyleScheme } from "../types/StyleScheme";
import { WindowObjectService } from "../../core/WindowObjectService";

const LOG = LogService.createLogger('WindowService');

export enum WindowServiceEvent {
    COLOR_SCHEME_CHANGED = "WindowServiceEvent:colorSchemeChanged",
    STORAGE_CHANGED = "WindowServiceEvent:storageChanged"
}

export type WindowServiceDestructor = ObserverDestructor;

export interface WindowServiceColorSchemeChangedEventCallback {
    (event: WindowServiceEvent.COLOR_SCHEME_CHANGED, scheme: ColorScheme) : void;
}

export interface WindowServiceStorageChangedEventCallback {
    (event: WindowServiceEvent.STORAGE_CHANGED, storageEvent: StorageEvent) : void;
}

interface MediaQueryListChangeCallback {
    (e : MediaQueryListEvent) : void;
}

export const DARK_COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

export interface StorageEventCallback {
    (event: StorageEvent): void;
}

export class WindowService {

    private static _observer                       : Observer<WindowServiceEvent> = new Observer<WindowServiceEvent>("WindowService");
    private static _watchMediaDarkScheme           : MediaQueryList | undefined;
    private static _watchMediaLightScheme          : MediaQueryList | undefined;
    private static _colorScheme                    : ColorScheme | undefined;
    private static _styleScheme                    : StyleScheme | undefined;
    private static _darkColorSchemeChangeCallback  : MediaQueryListChangeCallback | undefined;
    private static _storageCallback                : StorageEventCallback | undefined;


    public static Event = WindowServiceEvent;

    public static hasParent () : boolean {
        try {
            const w = WindowObjectService.getWindow();
            return w !== undefined && w !== WindowObjectService.getParent();
        } catch (err) {
            return false;
        }
    }

    public static isDarkModeEnabled () : boolean {
        return this.getColorScheme() === ColorScheme.DARK;
    }

    public static isLightModeEnabled () : boolean {
        return this.getColorScheme() === ColorScheme.LIGHT;
    }

    /**
     * This method returns the current color scheme in the browser.
     *
     * Check related ThemeService for app-level color scheme, which can also be changed in-app, and
     * includes a LocalStorage state.
     */
    public static getColorScheme () : ColorScheme {

        let colorScheme = this._colorScheme;

        if (colorScheme === undefined) {
            colorScheme = this._getColorScheme();
            this._colorScheme = colorScheme;
            LOG.info(`Color colorScheme initialized as ${stringifyColorScheme(colorScheme)}`);
            return colorScheme;
        }

        return colorScheme;

    }

    /**
     * This method returns the current style scheme in the browser.
     *
     * Check related ThemeService for app-level style scheme, which can also be changed in-app, and
     * includes a LocalStorage state.
     */
    public static getStyleScheme () : StyleScheme {

        let styleScheme = this._styleScheme;

        if (styleScheme === undefined) {
            styleScheme = this._getStyleScheme();
            this._styleScheme = styleScheme;
            LOG.info(`Style scheme initialized as ${stringifyStyleScheme(styleScheme)}`);
            return styleScheme;
        }

        return styleScheme;

    }

    public static on (eventName: WindowServiceEvent.COLOR_SCHEME_CHANGED, callback: WindowServiceColorSchemeChangedEventCallback) : WindowServiceDestructor;
    public static on (eventName: WindowServiceEvent.STORAGE_CHANGED     , callback: WindowServiceStorageChangedEventCallback)     : WindowServiceDestructor;

    // Implementation
    public static on (
        name     : WindowServiceEvent.COLOR_SCHEME_CHANGED | WindowServiceEvent.STORAGE_CHANGED,
        callback : WindowServiceColorSchemeChangedEventCallback | WindowServiceStorageChangedEventCallback
    ) : WindowServiceDestructor {

        if (name === WindowServiceEvent.COLOR_SCHEME_CHANGED) {

            if (!this._isWatchingMediaScheme()) {
                this._initializeMediaSchemeListeners();
            }

            let destructor : any = this._observer.listenEvent(name, callback as ObserverCallback<WindowServiceEvent>);

            return () => {
                try {
                    destructor();
                    destructor = undefined;
                } finally {
                    if (!this._observer.hasCallbacks(WindowServiceEvent.COLOR_SCHEME_CHANGED)) {
                        this._unInitializeMediaSchemeListeners();
                    }
                }
            };

        } else if (name === WindowServiceEvent.STORAGE_CHANGED) {

            if (!this._isWatchingStorageEvent()) {
                this._initializeStorageListener();
            }

            let destructor: any = this._observer.listenEvent(name, callback as ObserverCallback<WindowServiceEvent>);

            return () => {
                try {
                    destructor();
                    destructor = undefined;
                } finally {
                    if (!this._observer.hasCallbacks(WindowServiceEvent.STORAGE_CHANGED)) {
                        this._unInitializeStorageListener();
                    }
                }
            };

        } else {
            throw new TypeError(`WindowService: Unsupported event name: ${name}`);
        }

    }

    public static destroy () {

        this._unInitializeMediaSchemeListeners();
        this._unInitializeStorageListener();
        this._colorScheme = undefined;

    }


    private static _isWatchingStorageEvent () : boolean {
        return this._storageCallback !== undefined;
    }

    private static _initializeStorageListener () {

        if (this._storageCallback) {
            this._unInitializeStorageListener();
        }

        const w = WindowObjectService.getWindow();
        if (w) {
            this._storageCallback = this._onStorageEvent.bind(this);
            w.addEventListener('storage', this._storageCallback);
        } else {
            LOG.warn(`Cannot listen storage events. No window object detected.`);
        }

    }

    private static _unInitializeStorageListener () {
        if (this._storageCallback) {
            const w = WindowObjectService.getWindow();
            if (w) {
                w.removeEventListener('storage', this._storageCallback);
            } else {
                LOG.warn(`Cannot remove storage event listener. No window object detected.`);
            }
            this._storageCallback = undefined;
        }
    }

    private static _onStorageEvent (event: StorageEvent) {

        // const key         : string | null = event?.key;
        // const newValue    : string | null = event?.newValue;
        // const oldValue    : string | null = event?.oldValue;
        // const storageArea : Storage | null = event?.storageArea;
        // const url         : string = event?.url;

        this._observer.triggerEvent(WindowServiceEvent.STORAGE_CHANGED, event);

    }

    private static _isDarkModeEnabled () : boolean {
        const w = WindowObjectService.getWindow();
        if (!w) return false;
        return !!w.matchMedia(DARK_COLOR_SCHEME_QUERY)?.matches;
    }

    private static _getColorScheme () : ColorScheme {
        return this._isDarkModeEnabled() ? ColorScheme.DARK : ColorScheme.LIGHT;
    }

    private static _getStyleScheme () : StyleScheme {
        return StyleScheme.NEUMORPHISM;
    }

    private static _isWatchingMediaScheme () : boolean {
        return !!this._watchMediaDarkScheme && !!this._watchMediaLightScheme;
    }

    private static _initializeMediaSchemeListeners () {

        if ( this._watchMediaDarkScheme || this._watchMediaLightScheme ) {
            this._unInitializeMediaSchemeListeners();
        }

        const w = WindowObjectService.getWindow();
        if (!w) {
            LOG.warn(`No window object detected. Cannot setup media scheme listeners.`);
            return;
        }

        const darkCallback = this._darkColorSchemeChangeCallback = this._onDarkColorSchemeChange.bind(this);
        this._watchMediaDarkScheme = w.matchMedia(DARK_COLOR_SCHEME_QUERY);
        this._watchMediaDarkScheme.addEventListener('change', darkCallback);

        if (this._colorScheme === undefined) {
            const colorScheme = this._watchMediaDarkScheme.matches ? ColorScheme.DARK : ColorScheme.LIGHT;
            if (this._colorScheme !== colorScheme) {
                this._colorScheme = colorScheme;
                LOG.info(`Color colorScheme initialized as ${stringifyColorScheme(colorScheme)}`);
            }
        }

    }

    private static _unInitializeMediaSchemeListeners () {

        const darkCallback = this._darkColorSchemeChangeCallback;
        if ( this._watchMediaDarkScheme !== undefined && darkCallback !== undefined ) {
            this._watchMediaDarkScheme.removeEventListener('change', darkCallback);
            this._watchMediaDarkScheme = undefined;
            this._darkColorSchemeChangeCallback = undefined;
        }

    }

    private static _onDarkColorSchemeChange (e : MediaQueryListEvent) {
        const newColorScheme : ColorScheme = e.matches ? ColorScheme.DARK : ColorScheme.LIGHT;
        if (newColorScheme !== this._colorScheme) {
            this._colorScheme = newColorScheme;
            LOG.info(`Color scheme changed as ${stringifyColorScheme(newColorScheme)}`);
            this._observer.triggerEvent(WindowServiceEvent.COLOR_SCHEME_CHANGED, newColorScheme);
        } else {
            LOG.debug(`Color scheme was already same ${stringifyColorScheme(newColorScheme)}`);
        }
    }

}


