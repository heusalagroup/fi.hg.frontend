// Copyright (c) 2021-2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useState } from "react";
import { SmsTokenDTO } from "../../core/auth/sms/types/SmsTokenDTO";
import { SmsAuthSessionService, SmsAuthSessionServiceEvent } from "../services/SmsAuthSessionService";
import { useServiceEvent } from "./useServiceEvent";
import { LogService } from "../../core/LogService";

const LOG = LogService.createLogger('useSmsAuthSession');

export interface SmsAuthSessionData {
    readonly token      : SmsTokenDTO | undefined;
    readonly sms        : string | undefined;
    readonly isLoggedIn : boolean;
}

function createSmsAuthSessionData (
    token      : SmsTokenDTO | undefined,
    sms        : string | undefined,
    isLoggedIn : boolean
) : SmsAuthSessionData {
    return {
        token,
        sms,
        isLoggedIn
    };
}

export function useSmsAuthSession () : SmsAuthSessionData {

    const [ sessionData, setSessionData ] = useState<SmsAuthSessionData>(
        () => createSmsAuthSessionData(
            SmsAuthSessionService.getSmsToken(),
            SmsAuthSessionService.getSmsAddress(),
            SmsAuthSessionService.hasSession()
        )
    );

    const eventCallback = useCallback(
        () => {
            const token = SmsAuthSessionService.getSmsToken();
            const sms = SmsAuthSessionService.getSmsAddress();
            const isLoggedIn = SmsAuthSessionService.hasSession();
            if (
                sessionData.token !== token ||
                sessionData.sms !== sms ||
                sessionData.isLoggedIn !== isLoggedIn
            ) {
                LOG.debug(`Session data changed from event`);
                setSessionData(createSmsAuthSessionData(token, sms, isLoggedIn));
            } else {
                LOG.debug(`Session data event but values not changed`);
            }
        },
        [
            sessionData.token,
            sessionData.sms,
            sessionData.isLoggedIn
        ]
    );

    // When session service changes data
    useServiceEvent<SmsAuthSessionServiceEvent>(
        SmsAuthSessionService,
        SmsAuthSessionServiceEvent.SMS_TOKEN_UPDATED,
        eventCallback
    );

    return sessionData;

}
