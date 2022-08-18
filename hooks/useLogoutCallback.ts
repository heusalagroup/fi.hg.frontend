// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback } from "react";
import { EmailAuthSessionService } from "../services/EmailAuthSessionService";
import { LogService } from "../../core/LogService";

const LOG = LogService.createLogger('useLogoutCallback');

export function useLogoutCallback (context: string) {
    return useCallback(
        () => {
            LOG.debug(`Forgetting token from ${context}`);
            EmailAuthSessionService.forgetToken();
        },
        [
            context
        ]
    );
}
