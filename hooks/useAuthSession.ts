// Copyright (c) 2021-2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { EmailTokenDTO } from "../../core/auth/email/types/EmailTokenDTO";
import { SmsTokenDTO } from "../../core/auth/sms/types/SmsTokenDTO";
import { EmailAuthSessionData, useEmailAuthSession } from "./useEmailAuthSession";
import { SmsAuthSessionData, useSmsAuthSession } from "./useSmsAuthSession";

export interface AuthSessionData {
    readonly token       : EmailTokenDTO | SmsTokenDTO | undefined;
    readonly email      ?: string | undefined;
    readonly sms        ?: string | undefined;
    readonly isLoggedIn  : boolean;
}

export function useAuthSession () : AuthSessionData {
    const emailSession : EmailAuthSessionData = useEmailAuthSession();
    const smsSession : SmsAuthSessionData = useSmsAuthSession();
    if (smsSession.isLoggedIn) return smsSession;
    return emailSession;
}
