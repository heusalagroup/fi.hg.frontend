// Copyright (c) 2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { EmailTokenDTO } from "../../core/auth/email/types/EmailTokenDTO";
import { SmsTokenDTO } from "../../core/auth/sms/types/SmsTokenDTO";
import { EmailAuthSessionService } from "./EmailAuthSessionService";
import { SmsAuthSessionService } from "./SmsAuthSessionService";

export class AuthSessionService {

    public static getToken () : EmailTokenDTO | SmsTokenDTO | undefined {
        return EmailAuthSessionService.getEmailToken() ?? SmsAuthSessionService.getSmsToken();
    }

    public static forgetToken () : void {
        EmailAuthSessionService.forgetToken();
        SmsAuthSessionService.forgetToken();
    }

}
