// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useEffect } from "react";
import { VoidCallback } from "../../core/interfaces/callbacks";
import { LogService } from "../../core/LogService";
import { useLocation, Location } from "react-router-dom";

const LOG = LogService.createLogger('useLocationChange');

/**
 * Call callback when location changes
 *
 * @param context
 * @param callback
 */
export function useLocationChange (
    // @ts-ignore @todo why unused?
    context: string,
    callback: VoidCallback
) : Location {
    const location = useLocation();
    useEffect(
        () => {
            LOG.debug('Location changed: ', location);
            callback();
        },
        [
            location,
            callback
        ]
    );
    return location;
}
