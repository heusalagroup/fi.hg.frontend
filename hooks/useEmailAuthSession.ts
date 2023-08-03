// Copyright (c) 2021-2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useState } from "react";
import { EmailTokenDTO } from "../../core/auth/email/types/EmailTokenDTO";
import { EmailAuthSessionService, EmailAuthSessionServiceEvent } from "../services/EmailAuthSessionService";
import { useServiceEvent } from "./useServiceEvent";
import { LogService } from "../../core/LogService";

const LOG = LogService.createLogger('useEmailAuthSession');

export interface EmailAuthSessionData {
    readonly token      : EmailTokenDTO | undefined;
    readonly email      : string | undefined;
    readonly isLoggedIn : boolean;
}

function createEmailAuthSessionData (
    token      : EmailTokenDTO | undefined,
    email      : string | undefined,
    isLoggedIn : boolean
) : EmailAuthSessionData {
    return {
        token,
        email,
        isLoggedIn
    };
}

export function useEmailAuthSession () : EmailAuthSessionData {

    const [ sessionData, setSessionData ] = useState<EmailAuthSessionData>(
        () => createEmailAuthSessionData(
            EmailAuthSessionService.getEmailToken(),
            EmailAuthSessionService.getEmailAddress(),
            EmailAuthSessionService.hasSession()
        )
    );

    const eventCallback = useCallback(
        () => {
            const token = EmailAuthSessionService.getEmailToken();
            const email = EmailAuthSessionService.getEmailAddress();
            const isLoggedIn = EmailAuthSessionService.hasSession();
            if (
                sessionData.token !== token ||
                sessionData.email !== email ||
                sessionData.isLoggedIn !== isLoggedIn
            ) {
                LOG.debug(`Session data changed from event`);
                setSessionData(createEmailAuthSessionData(token, email, isLoggedIn));
            } else {
                LOG.debug(`Session data event but values not changed`);
            }
        },
        [
            sessionData.token,
            sessionData.email,
            sessionData.isLoggedIn
        ]
    );

    // When session service changes data
    useServiceEvent<EmailAuthSessionServiceEvent>(
        EmailAuthSessionService,
        EmailAuthSessionServiceEvent.EMAIL_TOKEN_UPDATED,
        eventCallback
    );

    return sessionData;
}
