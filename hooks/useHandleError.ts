// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback } from "react";
import { LogService } from "../../core/LogService";

const LOG = LogService.createLogger('useHandleError');

export interface HandleErrorCallback {
    (err: any) : void;
}

export function useHandleError (
    context: string
) : HandleErrorCallback {
    return useCallback(
        (err: any) => {
            LOG.error(`${context}: Error: `, err);
        },
        [
            context
        ]
    );
}
