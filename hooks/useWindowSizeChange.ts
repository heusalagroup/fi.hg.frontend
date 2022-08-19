// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useEffect } from "react";
import { VoidCallback } from "../../core/interfaces/callbacks";
import { LogService } from "../../core/LogService";
import { useWindowSize, WindowSize } from "./useWindowSize";

const LOG = LogService.createLogger('useWindowSizeChange');

/**
 * Call callback when window size changes
 *
 * @param context
 * @param callback
 */
export function useWindowSizeChange (
    context: string,
    callback: VoidCallback
) : WindowSize {
    const windowSize = useWindowSize();
    useEffect(
        () => {
            LOG.debug(`${context}: Window size changed: `, windowSize);
            callback();
        },
        [
            context,
            windowSize,
            callback
        ]
    );
    return windowSize;
}
