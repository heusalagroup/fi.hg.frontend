// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { VoidCallback } from "../../core/interfaces/callbacks";
import { LogService } from "../../core/LogService";
import { useEffect } from "react";
import { useScrollTop } from "./useScrollTop";

const LOG = LogService.createLogger('useScrollTopChange');

/**
 * Calls callback when scroll changes
 *
 * @param context
 * @param callback
 */
export function useScrollTopChange (
    context: string,
    callback: VoidCallback
) : number | undefined {
    const scrollTop = useScrollTop(window?.document?.scrollingElement);
    useEffect(
        () => {
            LOG.debug('Scroll detected');
            callback();
        },
        [
            scrollTop,
            callback
        ]
    );
    return scrollTop;
}
