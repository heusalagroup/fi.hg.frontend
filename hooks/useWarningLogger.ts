// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback } from "react";
import { LogService } from "../../core/LogService";

const LOG = LogService.createLogger('useWarningLogger');

export interface WarningLoggerCallback {
    (message: string) : void;
}

export function useWarningLogger (
    context: string
) : WarningLoggerCallback {
    return useCallback(
        (message: any) => {
            LOG.warn(`${context}: Warning: `, message);
        },
        [
            context
        ]
    );
}
