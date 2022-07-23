// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useEffect, useState } from "react";
import { EmailTokenDTO } from "../../core/auth/email/types/EmailTokenDTO";
import { EmailAuthSessionService } from "../services/EmailAuthSessionService";

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
        createEmailAuthSessionData(
            EmailAuthSessionService.getEmailToken(),
            EmailAuthSessionService.getEmailAddress(),
            EmailAuthSessionService.hasSession()
        )
    );

    // When session service changes data
    useEffect(() => {
        return EmailAuthSessionService.on(
            EmailAuthSessionService.Event.EMAIL_TOKEN_UPDATED,
            () => {

                const token = EmailAuthSessionService.getEmailToken();
                const email = EmailAuthSessionService.getEmailAddress();
                const isLoggedIn = EmailAuthSessionService.hasSession();

                if (
                    sessionData.token !== token ||
                    sessionData.email !== email ||
                    sessionData.isLoggedIn !== isLoggedIn
                ) {
                    setSessionData(createEmailAuthSessionData(token, email, isLoggedIn));
                }

            }
        );
    });

    return sessionData;

}
