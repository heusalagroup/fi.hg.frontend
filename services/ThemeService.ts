// Copyright (c) 2021-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { WindowService, WindowServiceDestructor, WindowServiceEvent} from "./WindowService";
import { Observer, ObserverDestructor} from "../../core/Observer";
import {ColorScheme, isColorScheme, stringifyColorScheme} from "../../core/style/types/ColorScheme";
import { LogService } from "../../core/LogService";
import { ThemeLocalStorageService,
    ThemeLocalStorageServiceDestructor,
    ThemeLocalStorageServiceEvent
} from "./ThemeLocalStorageService";
import { WindowEventService,
    WindowEventServiceDestructor,
    WindowEventServiceEvent,
    WindowServiceEventTargetObject
} from "./WindowEventService";
import {JsonObject} from "../../core/Json";
import { isStyleScheme, stringifyStyleScheme, StyleScheme } from "../types/StyleScheme";

const LOG = LogService.createLogger('ThemeService');

export enum ThemeServiceEvent {
    COLOR_SCHEME_CHANGED = "ThemeService:colorSchemeChanged",
    STYLE_SCHEME_CHANGED = "ThemeService:styleSchemeChanged"
}

export type ThemeServiceDestructor = ObserverDestructor;

export interface ThemeServiceColorSchemeChangedEventCallback {
    (event: ThemeServiceEvent.COLOR_SCHEME_CHANGED, scheme: ColorScheme) : void;
}

export interface ThemeServiceStyleSchemeChangedEventCallback {
    (event: ThemeServiceEvent.STYLE_SCHEME_CHANGED, scheme: StyleScheme) : void;
}

export enum ThemeServiceMessageType {
    COLOR_SCHEME_CHANGED = "fi.nor.ui.ThemeService:colorSchemeChanged",
    STYLE_SCHEME_CHANGED = "fi.nor.ui.ThemeService:styleSchemeChanged"
}

export interface ThemeColorSchemeChangeMessageDTO {
    readonly type  : ThemeServiceMessageType.COLOR_SCHEME_CHANGED;
    readonly value : ColorScheme | undefined;
}

export function isColorSchemeThemeChangeMessageDTO (value : any) : value is ThemeColorSchemeChangeMessageDTO {
    return (
        !!value
        && value?.type === ThemeServiceMessageType.COLOR_SCHEME_CHANGED
        && ( value?.value === undefined || isColorScheme(value?.value) )
    );
}

export interface ThemeStyleSchemeChangeMessageDTO {
    readonly type  : ThemeServiceMessageType.STYLE_SCHEME_CHANGED;
    readonly value : StyleScheme | undefined;
}

export function isStyleSchemeThemeChangeMessageDTO (value : any) : value is ThemeStyleSchemeChangeMessageDTO {
    return (
        !!value
        && value?.type === ThemeServiceMessageType.STYLE_SCHEME_CHANGED
        && ( value?.value === undefined || isStyleScheme(value?.value) )
    );
}

export class ThemeService {

    private static _observer                   : Observer<ThemeServiceEvent> = new Observer<ThemeServiceEvent>("ThemeService");
    private static _colorScheme                : ColorScheme | undefined;
    private static _styleScheme                : StyleScheme | undefined;
    private static _windowServiceListener      : WindowServiceDestructor | undefined;
    private static _storageServiceListener     : ThemeLocalStorageServiceDestructor | undefined;
    private static _windowEventServiceListener : WindowEventServiceDestructor | undefined;

    public static Event = ThemeServiceEvent;

    public static hasDarkMode () : boolean {
        return this.getColorScheme() === ColorScheme.DARK;
    }

    public static hasLightMode () : boolean {
        return this.getColorScheme() === ColorScheme.LIGHT;
    }

    public static getColorScheme () : ColorScheme {
        return this._colorScheme ?? ThemeLocalStorageService.getColorScheme() ?? WindowService.getColorScheme();
    }

    public static setColorScheme (value: ColorScheme | undefined) : ThemeService {

        if (this._colorScheme !== value) {

            this._colorScheme = value;

            if (ThemeLocalStorageService.getColorScheme() !== value) {
                ThemeLocalStorageService.setColorScheme(value);
            }

            if (this._observer.hasCallbacks(ThemeServiceEvent.COLOR_SCHEME_CHANGED)) {
                if (value === undefined) {
                    this._observer.triggerEvent(ThemeServiceEvent.COLOR_SCHEME_CHANGED, WindowService.getColorScheme());
                } else {
                    this._observer.triggerEvent(ThemeServiceEvent.COLOR_SCHEME_CHANGED, value);
                }
            }

            LOG.debug(`Color scheme changed by user as ${this._colorScheme ? stringifyColorScheme(this._colorScheme) : 'default'}`);

        }

        return this;
    }


    public static getStyleScheme () : StyleScheme {
        return this._styleScheme ?? ThemeLocalStorageService.getStyleScheme() ?? WindowService.getStyleScheme();
    }

    public static setStyleScheme (value: StyleScheme | undefined) : ThemeService {

        if (this._styleScheme !== value) {

            this._styleScheme = value;

            if (ThemeLocalStorageService.getStyleScheme() !== value) {
                ThemeLocalStorageService.setStyleScheme(value);
            }

            if (this._observer.hasCallbacks(ThemeServiceEvent.STYLE_SCHEME_CHANGED)) {
                if (value === undefined) {
                    this._observer.triggerEvent(ThemeServiceEvent.STYLE_SCHEME_CHANGED, WindowService.getStyleScheme());
                } else {
                    this._observer.triggerEvent(ThemeServiceEvent.STYLE_SCHEME_CHANGED, value);
                }
            }

            LOG.debug(`Style scheme changed by user as ${this._styleScheme ? stringifyStyleScheme(this._styleScheme) : 'default'}`);

        }

        return this;
    }

    public static on (eventName: ThemeServiceEvent.COLOR_SCHEME_CHANGED, callback: ThemeServiceColorSchemeChangedEventCallback) : ThemeServiceDestructor;
    public static on (eventName: ThemeServiceEvent.STYLE_SCHEME_CHANGED, callback: ThemeServiceStyleSchemeChangedEventCallback) : ThemeServiceDestructor;

    // Implementation
    public static on (
        name     : ThemeServiceEvent.COLOR_SCHEME_CHANGED | ThemeServiceEvent.STYLE_SCHEME_CHANGED,
        callback : ThemeServiceColorSchemeChangedEventCallback | ThemeServiceStyleSchemeChangedEventCallback
    ) : ThemeServiceDestructor {

        if ( name === ThemeServiceEvent.COLOR_SCHEME_CHANGED || name === ThemeServiceEvent.STYLE_SCHEME_CHANGED ) {

            if ( this._windowServiceListener === undefined ) {
                this._startWindowServiceListener();
            }

            if (this._storageServiceListener === undefined) {
                this._startLocalStorageListener();
            }

            if (this._windowEventServiceListener === undefined) {
                this._startWindowEventServiceListener();
            }

            let destructor : any = this._observer.listenEvent(name, callback as any);

            return () => {
                try {
                    destructor();
                    destructor = undefined;
                } finally {
                    if (
                        !this._observer.hasCallbacks(ThemeServiceEvent.COLOR_SCHEME_CHANGED)
                        && !this._observer.hasCallbacks(ThemeServiceEvent.STYLE_SCHEME_CHANGED)
                    ) {
                        this._removeWindowServiceListener();
                        this._removeLocalStorageListener();
                        this._removeWindowEventServiceListener();
                    }
                }
            };

        } else {
            throw new TypeError(`ThemeService: Unsupported event name: ${name}`);
        }

    }

    public static destroy () {

        this._removeWindowServiceListener();
        this._removeLocalStorageListener();
        this._colorScheme = undefined;

    }

    /**
     * Sends a message to set color scheme on remote target.
     *
     * This should be something that can receive events.
     *
     * @param target This should be the object from `window.open()` or `window.opener()` or `HTMLIFrameElement.contentWindow` or `window.parent`, etc
     * @param value The color schema to use. If you specify 'undefined' the user defined value will be removed (eg. browser's choice will be active then).
     * @param origin Optional origin. Generally it's unsafe to use '*' but dark/light theme value is not very big secret.
     */
    public static setRemoteColorScheme (
        value  : ColorScheme | undefined,
        target : WindowServiceEventTargetObject,
        origin : string = '*'
    ) {

        const message : ThemeColorSchemeChangeMessageDTO = {
            type: ThemeServiceMessageType.COLOR_SCHEME_CHANGED,
            value: value
        };

        const messageString = JSON.stringify(message);

        target.postMessage(messageString, origin);

    }

    /**
     * Sends a message to remove a color scheme from remote target.
     *
     * This should be something that can receive events.
     *
     * @param target This should be the object from `window.open()` or `window.opener()` or `HTMLIFrameElement.contentWindow` or `window.parent`, etc
     * @param origin Optional origin. Generally it's unsafe to use '*' but dark/light theme value is not very big secret.
     */
    public static unsetRemoteColorScheme (
        target : WindowServiceEventTargetObject,
        origin : string = '*'
    ) {
        return this.setRemoteColorScheme(undefined, target, origin);
    }

    private static _startWindowEventServiceListener () {

        this._windowEventServiceListener = WindowEventService.on(
            WindowEventService.Event.JSON_MESSAGE,
            (
                // @ts-ignore @todo why unused?
                event: WindowEventServiceEvent.JSON_MESSAGE,
                message: JsonObject) => {
                if (this._observer.hasCallbacks(ThemeServiceEvent.COLOR_SCHEME_CHANGED)) {
                    if (isColorSchemeThemeChangeMessageDTO(message)) {
                        LOG.debug(`Color scheme changed through a message as ${stringifyColorScheme(message.value)}`);
                        this.setColorScheme(message.value);
                    }
                } else {
                    LOG.warn(`Warning! We are listening events for browser color scheme when we don't have our own listeners.`);
                }
            }
        );

    }

    private static _removeWindowEventServiceListener () {

        if (this._windowEventServiceListener) {
            this._windowEventServiceListener();
            this._windowEventServiceListener = undefined;
        }

    }


    private static _startWindowServiceListener () {

        this._windowServiceListener = WindowService.on(
            WindowService.Event.COLOR_SCHEME_CHANGED,
            (
                // @ts-ignore @todo why unused?
                event: WindowServiceEvent,
                colorScheme: ColorScheme) => {
                if (this._observer.hasCallbacks(ThemeServiceEvent.COLOR_SCHEME_CHANGED)) {
                    if (this._colorScheme === undefined) {
                        LOG.debug(`Browser color scheme changed as ${stringifyColorScheme(WindowService.getColorScheme())}`);
                        this._observer.triggerEvent(ThemeServiceEvent.COLOR_SCHEME_CHANGED, colorScheme);
                    } else {
                        LOG.warn(`Warning! We are listening events for browser color scheme when we already have our own state.`);
                    }
                } else {
                    LOG.warn(`Warning! We are listening events for browser color scheme when we don't have our own listeners.`);
                }
            }
        );

    }

    private static _removeWindowServiceListener () {

        if (this._windowServiceListener) {
            this._windowServiceListener();
            this._windowServiceListener = undefined;
        }

    }


    private static _startLocalStorageListener () {

        this._storageServiceListener = ThemeLocalStorageService.on(
            ThemeLocalStorageServiceEvent.COLOR_SCHEME_CHANGED,
            (
                // @ts-ignore @todo why unused?
                event: ThemeLocalStorageServiceEvent.COLOR_SCHEME_CHANGED
            ) => {
                if (this._observer.hasCallbacks(ThemeServiceEvent.COLOR_SCHEME_CHANGED)) {
                    if (this._colorScheme === undefined) {
                        LOG.debug(`Local storage color scheme changed as ${stringifyColorScheme(ThemeLocalStorageService.getColorScheme())}`);
                        this._observer.triggerEvent(ThemeServiceEvent.COLOR_SCHEME_CHANGED, this.getColorScheme());
                    } else {
                        LOG.warn(`Warning! We are listening events for local storage color scheme when we already have our own state.`);
                    }
                } else {
                    LOG.warn(`Warning! We are listening events for local storage color scheme when we don't have our own listeners.`);
                }
            }
        );

    }

    private static _removeLocalStorageListener () {

        if (this._storageServiceListener) {
            this._storageServiceListener();
            this._storageServiceListener = undefined;
        }

    }

}


