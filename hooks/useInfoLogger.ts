// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback } from "react";
import { LogService } from "../../core/LogService";

const LOG = LogService.createLogger('useInfoLogger');

export interface InfoLoggerCallback {
    (message: string) : void;
}

export function useInfoLogger (
    context: string
) : InfoLoggerCallback {
    return useCallback(
        (message: any) => {
            LOG.info(`${context}: Info: `, message);
        },
        [
            context
        ]
    );
}
