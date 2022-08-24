// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { Observer, ObserverCallback, ObserverDestructor } from "../../core/Observer";
import { VoidCallback } from "../../core/interfaces/callbacks";
import { LogService } from "../../core/LogService";
import { WindowObjectService } from "../../core/WindowObjectService";

const LOG = LogService.createLogger('WindowSizeService');

const RESIZE_DELAY_TIMEOUT = 200;

export enum WindowSizeServiceEvent {
    RESIZED = "WindowSizeService:resized"
}

export type WindowSizeServiceDestructor = ObserverDestructor;

export class WindowSizeService {

    private static _resizeTimeout : any | undefined = undefined;
    private static _handleResize  : VoidCallback | undefined = undefined;

    private static _observer: Observer<WindowSizeServiceEvent> = new Observer<WindowSizeServiceEvent>(
        "WindowSizeService");

    public static Event = WindowSizeServiceEvent;

    public static getWidth () : number | undefined {
        const w = WindowObjectService.getWindow();
        return w?.innerWidth;
    }

    public static getHeight () : number | undefined {
        const w = WindowObjectService.getWindow();
        return w?.innerHeight;
    }

    public static on (
        name     : WindowSizeServiceEvent,
        callback : ObserverCallback<WindowSizeServiceEvent>
    ): WindowSizeServiceDestructor {
        const resizeCheck : boolean = name === WindowSizeServiceEvent.RESIZED;
        if (resizeCheck && !this._observer.hasCallbacks(WindowSizeServiceEvent.RESIZED)) {
            this._startListeningResize();
        }
        const destructor = this._observer.listenEvent(name, callback);
        return () => {
            destructor();
            try {
                if (resizeCheck && !this._observer.hasCallbacks(WindowSizeServiceEvent.RESIZED)) {
                    this._stopListeningResize();
                }
            } catch (err) {
                LOG.error(`on(${name}): Could not stop listening resize`)
            }
        };
    }

    public static destroy (): void {
        this._observer.destroy();
    }

    private static _onResize () {
        if (this._resizeTimeout !== undefined) {
            clearTimeout(this._resizeTimeout);
            this._resizeTimeout = undefined;
        }
        this._resizeTimeout = setTimeout( () => {
            this._observer.triggerEvent(this.Event.RESIZED);
        }, RESIZE_DELAY_TIMEOUT)
    }

    private static _startListeningResize () {
        if ( this._handleResize === undefined ) {
            const w = WindowObjectService.getWindow();
            if (w) {
                this._handleResize = WindowSizeService._onResize.bind(this);
                w.addEventListener("resize", this._handleResize);
            } else {
                LOG.warn(`Warning! Could not add event listener for "resize" since no window object`);
            }
        } else {
            LOG.warn(`Warning! Already listening resize`);
        }
    }

    private static _stopListeningResize () {
        if (this._resizeTimeout !== undefined) {
            clearTimeout(this._resizeTimeout);
            this._resizeTimeout = undefined;
        }
        if (this._handleResize !== undefined && WindowObjectService.hasWindow() ) {
            const w = WindowObjectService.getWindow();
            if (w) {
                w.removeEventListener("resize", this._handleResize);
            } else {
                LOG.warn(`Warning! Could not remove event listener for "resize" since no window object`);
            }
            this._handleResize = undefined;
        }
    }

}
