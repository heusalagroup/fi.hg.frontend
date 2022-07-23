// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { LogService } from "../../core/LogService";
import { Observer,  ObserverCallback, ObserverDestructor } from "../../core/Observer";

const LOG = LogService.createLogger('RouteService');

export enum RouteServiceEvent {

    PUSH_HISTORY = "RouteService:pushHistory"

}

export type RouteServiceDestructor = ObserverDestructor;

/**
 * See also HistoryServiceSwitch from ../components/router/HistoryServiceSwitch.tsx
 */
export class RouteService {

    private static _observer: Observer<RouteServiceEvent> = new Observer<RouteServiceEvent>("RouteService");

    private static _nextHistory : string | undefined;

    public static Event = RouteServiceEvent;

    public static on (
        name: RouteServiceEvent,
        callback: ObserverCallback<RouteServiceEvent>
    ): RouteServiceDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public static destroy (): void {
        this._observer.destroy();
    }

    public static getNextHistory () : string | undefined {
        const history = this._nextHistory;
        this._nextHistory = undefined;
        LOG.debug(`Route fetched: ${history}`);
        return history;
    }

    /**
     * To use this you need to use `HistoryServiceSwitch` component from
     *    ../components/router/HistoryServiceSwitch.tsx
     * or implement your own `RouteServiceEvent.PUSH_HISTORY` implementation in your app.
     */
    public static setRoute (value : string) {

        if (this._observer.hasCallbacks(RouteServiceEvent.PUSH_HISTORY)) {
            LOG.debug(`Triggering route to: ${value}`);
            this._observer.triggerEvent(RouteServiceEvent.PUSH_HISTORY, value);
        } else {
            LOG.debug(`Route saved for later use: ${value}`);
            this._nextHistory = value;
        }

    }

}


