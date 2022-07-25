// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useEffect } from "react";
import { LogService } from "../../core/LogService";
import { VoidCallback } from "../../core/interfaces/callbacks";
import { isPromise } from "../../core/modules/lodash";
import { ObserverCallback, ObserverDestructor } from "../../core/Observer";

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
    callback: VoidCallback
) {
    return useEffect(
        () => {
            return Service.on(
                event,
                () => {
                    LOG.debug(`Event "${event.toString()}": Calling callback`);
                    try {
                        const p = callback();
                        if ( isPromise(p) ) {
                            p.catch((err: any) => {
                                LOG.error(`Event "${event.toString()}": Callback error: `, err);
                            });
                        }
                    } catch (err: any) {
                        LOG.error(`Event "${event.toString()}": Callback exception: `, err);
                    }
                }
            );
        },
        [
            Service,
            callback,
            event
        ]
    );
}
