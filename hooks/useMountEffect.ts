// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { VoidCallback } from "../../core/interfaces/callbacks";
import { useEffect } from "react";
import { LogService } from "../../core/LogService";

const LOG = LogService.createLogger('useMountEffect');

/** Call update states when mounted and unmounted
 *
 * @param identifier
 * @param mountCallback
 * @param unmountCallback
 */
export function useMountEffect (
    identifier       : string,
    mountCallback    : VoidCallback,
    unmountCallback ?: VoidCallback
) {
    useEffect(
        () => {
            LOG.debug(`${identifier}: Mount`);
            mountCallback();
            if ( unmountCallback ) {
                return () => {
                    LOG.debug(`${identifier}: Unmount`);
                    unmountCallback();
                };
            }
        },
        [
            identifier,
            mountCallback,
            unmountCallback
        ]
    );
}
