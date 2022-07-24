// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useRef } from "react";
import { LogService } from "../../core/LogService";
import { VoidCallback } from "../../core/interfaces/callbacks";

const LOG = LogService.createLogger('useDelayedCallback');

export function useDelayedCallback (
    callback: VoidCallback,
    timeoutMs: number
) : [VoidCallback, VoidCallback] {

    let timeoutRef : any | undefined = useRef<any | undefined>(undefined);

    const cancelCallback = useCallback(
        () => {
            if ( timeoutRef.current !== undefined ) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = undefined;
        },
        [
            timeoutRef
        ]
    );

    const delayedCallback = useCallback(
        () => {
            cancelCallback();
            timeoutRef.current = setTimeout(() => {
                try {
                    timeoutRef.current = undefined;
                    callback();
                } catch (err) {
                    LOG.error(`Error: `, err);
                }
            }, timeoutMs);
        },
        [
            callback,
            cancelCallback,
            timeoutMs
        ]
    );

    return [
        delayedCallback,
        cancelCallback
    ];

}
