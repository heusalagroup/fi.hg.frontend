// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback } from "react";
import { LogService } from "../../core/LogService";

const LOG = LogService.createLogger('useDebugLogger');

export interface DebugLoggerCallback {
    (message: string) : void;
}

export function useDebugLogger (
    context: string
) : DebugLoggerCallback {
    return useCallback(
        (message: any) => {
            LOG.debug(`${context}: `, message);
        },
        [
            context
        ]
    );
}
