// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useEffect } from "react";
import { LogService } from "../../core/LogService";
import { EventCallbackWithArgs, VoidCallback } from "../../core/interfaces/callbacks";
import { ObserverCallback, ObserverDestructor } from "../../core/Observer";
import { isPromise } from "../../core/types/Promise";

const LOG = LogService.createLogger('useServiceEvent');

/**
 *
 * @param Service
 * @param event
 * @param callback If callback has dependencies, you should wrap it inside useCallback!
 */
export function useServiceEvent<T extends keyof any> (
    Service: {
        on (
            name: T,
            callback: ObserverCallback<T>
        ): ObserverDestructor
    },
    event: T,
    callback: EventCallbackWithArgs<T>
) {
    const onEventCallback = useCallback(
        (eventName: T, ...params: any[]) => {
            LOG.debug(`Event "${event.toString()}": Calling callback`);
            try {
                const p : unknown = callback(eventName, ...params);
                if ( isPromise(p) ) {
                    p.catch((err: any) => {
                        LOG.error(`Event "${event.toString()}": Callback error: `, err);
                    });
                }
            } catch (err: any) {
                LOG.error(`Event "${event.toString()}": Callback exception: `, err);
            }
        },
        [
            event,
            callback
        ]
    );
    return useEffect(
        () =>
            Service.on(
                event,
                onEventCallback
            ),
        [
            onEventCallback,
            Service,
            event
        ]
    );
}
