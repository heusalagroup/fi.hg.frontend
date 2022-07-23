// Copyright (c) 2021-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { LogService } from "../../core/LogService";
import { Observer, ObserverCallback, ObserverDestructor} from "../../core/Observer";
import {JsonObject} from "../../core/Json";
import {isString} from "../../core/modules/lodash";

const LOG = LogService.createLogger('WindowEventService');

/**
 * Any object that has postMessage API.
 */
export interface WindowServiceEventTargetInterface {
    postMessage(
        message       : any,
        targetOrigin  : string,
        transfer     ?: ArrayBuffer | MessagePort | ImageBitmap
    ) : void;
}

export type WindowServiceEventTargetObject = Window | WindowServiceEventTargetInterface;

export enum WindowEventServiceEvent {

    /**
     * Any event object. If this listener is defined, it will receive every raw event object.
     */
    MESSAGE_EVENT = "WindowEventService:messageEvent",

    /**
     * Receives plain string event messages.
     *
     * This event handler will be triggered for any string message.
     *
     * If you have a JSON event listener, those will not be passed here. Otherwise, it will receive
     * those messages, too.
     */
    STRING_MESSAGE      = "WindowEventService:stringMessage",

    /**
     * Receives parsed JSON events
     */
    JSON_MESSAGE = "WindowEventService:jsonMessage",

}

export interface WindowEventServiceMessageEventCallback {
    (name: WindowEventServiceEvent.MESSAGE_EVENT, event: MessageEvent) : void;
}

export interface WindowEventServiceStringMessageEventCallback {
    (name: WindowEventServiceEvent.STRING_MESSAGE, data: string, origin: string) : void;
}

export interface WindowEventServiceJsonMessageEventCallback {
    (name: WindowEventServiceEvent.JSON_MESSAGE, data: JsonObject, origin: string) : void;
}

export type WindowEventServiceDestructor = ObserverDestructor;

export interface WindowEventCallback {
    (event: MessageEvent) : void;
}

/**
 * Service which can pass on messages to other instances, including from parent session to iframe session(s).
 */
export class WindowEventService {

    private static _observer         : Observer<WindowEventServiceEvent> = new Observer<WindowEventServiceEvent>("WindowEventService");
    private static _messageCallback  : WindowEventCallback | undefined = undefined;


    public static Event = WindowEventServiceEvent;

    public static on (name: WindowEventServiceEvent.MESSAGE_EVENT  , callback: WindowEventServiceMessageEventCallback)       : WindowEventServiceDestructor;
    public static on (name: WindowEventServiceEvent.STRING_MESSAGE , callback: WindowEventServiceStringMessageEventCallback) : WindowEventServiceDestructor;
    public static on (name: WindowEventServiceEvent.JSON_MESSAGE   , callback: WindowEventServiceJsonMessageEventCallback)   : WindowEventServiceDestructor;

    public static on (
        name     : WindowEventServiceEvent.MESSAGE_EVENT  | WindowEventServiceEvent.STRING_MESSAGE       | WindowEventServiceEvent.JSON_MESSAGE,
        callback : WindowEventServiceMessageEventCallback | WindowEventServiceStringMessageEventCallback | WindowEventServiceJsonMessageEventCallback
    ) : WindowEventServiceDestructor {

        if ( name === WindowEventServiceEvent.MESSAGE_EVENT || name === WindowEventServiceEvent.STRING_MESSAGE || name === WindowEventServiceEvent.JSON_MESSAGE ) {

            if (!this._messageCallback) {
                this._initializeWindowMessageListener();
            }

            let destructor : any = this._observer.listenEvent(name, callback as ObserverCallback<WindowEventServiceEvent>);

            return () => {
                try {
                    destructor();
                    destructor = undefined;
                } finally {
                    if (
                        !this._observer.hasCallbacks(WindowEventServiceEvent.MESSAGE_EVENT)
                        &&
                        !this._observer.hasCallbacks(WindowEventServiceEvent.STRING_MESSAGE)
                        &&
                        !this._observer.hasCallbacks(WindowEventServiceEvent.JSON_MESSAGE)
                    ) {
                        this._unInitializeWindowMessageListener();
                    }
                }
            };

        } else {
            throw new TypeError(`Unsupported event provided: ${name}`);
        }

    }

    public static destroy () {
        this._unInitializeWindowMessageListener();
    }

    private static _initializeWindowMessageListener () {

        if (this._messageCallback) {
            this._unInitializeWindowMessageListener();
        }

        this._messageCallback = this._processMessageEventObject.bind(this);

        if (typeof window !== 'undefined') {
            window.addEventListener('message', this._messageCallback);
        } else {
            LOG.warn(`Cannot listen message events. No window object detected.`);
        }

    }

    private static _unInitializeWindowMessageListener () {

        if (this._messageCallback) {

            window.removeEventListener('message', this._messageCallback);

            this._messageCallback = undefined;
        }

    }

    private static _processMessageEventObject (event : MessageEvent) {

        const hasObjectListeners = this._observer.hasCallbacks(WindowEventServiceEvent.MESSAGE_EVENT);

        if (hasObjectListeners) {
            this._processObjectMessage(event);
        }

        const dataString : any = event?.data;
        const dataOrigin : string = event?.origin ?? '';

        if (isString(dataString)) {
            this._processMessageEventString(dataString, dataOrigin);
        }

    }

    private static _processMessageEventString (dataString : string, dataOrigin : string) {

        const hasJsonListeners = this._observer.hasCallbacks(WindowEventServiceEvent.JSON_MESSAGE);

        if (hasJsonListeners) {

            const l = dataString?.length ?? 0;
            if ( l >= 2 && dataString[0] === '{' && dataString[l-1] === '}') {
                try {
                    let data = JSON.parse(dataString);
                    return this._processJsonMessage(data, dataOrigin);
                } catch(err) {
                    // Probably not our message. Let's ignore and pass it to message handler.
                }
            }

        }

        const hasObjectListeners = this._observer.hasCallbacks(WindowEventServiceEvent.MESSAGE_EVENT);
        const hasPlainListeners = this._observer.hasCallbacks(WindowEventServiceEvent.STRING_MESSAGE);

        if (hasPlainListeners) {
            this._processStringMessage(dataString, dataOrigin);
        } else if(!hasJsonListeners && !hasObjectListeners) {
            LOG.warn(`Warning! We did not have event listeners but were still listening events. This is probably a bug.`);
        }

    }

    private static _processJsonMessage (data: JsonObject, origin: string) {
        this._observer.triggerEvent(WindowEventServiceEvent.JSON_MESSAGE, data, origin);
    }

    private static _processStringMessage (data: string, origin: string) {
        this._observer.triggerEvent(WindowEventServiceEvent.STRING_MESSAGE, data, origin);
    }

    private static _processObjectMessage (data: MessageEvent) {
        this._observer.triggerEvent(WindowEventServiceEvent.MESSAGE_EVENT, data);
    }

}


