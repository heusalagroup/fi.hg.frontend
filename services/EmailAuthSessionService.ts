// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { EmailTokenDTO, isEmailTokenDTO } from "../../core/auth/email/types/EmailTokenDTO";
import { Observer, ObserverCallback, ObserverDestructor } from "../../core/Observer";
import { LogService } from "../../core/LogService";
import { JsonLocalStorageService } from "./JsonLocalStorageService";
import { Language } from "../../core/types/Language";
import { JsonAny } from "../../core/Json";
import { EmailAuthHttpService } from "./EmailAuthHttpService";

const LOG = LogService.createLogger('EmailAuthSessionService');

export enum EmailAuthSessionServiceEvent {
    EMAIL_TOKEN_UPDATED     = "EmailAuthSessionService:emailTokenUpdated",
}

export type EmailAuthSessionServiceDestructor = ObserverDestructor;

export class EmailAuthSessionService {

    private static _localStorageKey : string = "fi.hg.auth.email.session";
    private static _emailToken : EmailTokenDTO | undefined = EmailAuthSessionService._getEmailTokenFromLocalStorage();
    private static _observer: Observer<EmailAuthSessionServiceEvent> = new Observer<EmailAuthSessionServiceEvent>("EmailAuthSessionService");

    public static Event = EmailAuthSessionServiceEvent;

    public static setLocalStorageKey (key: string) {
        EmailAuthSessionService._localStorageKey = key;
        // FIXME: When this changes, we should try to read it from storage
    }

    public static on (
        name: EmailAuthSessionServiceEvent,
        callback: ObserverCallback<EmailAuthSessionServiceEvent>
    ): EmailAuthSessionServiceDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public static destroy (): void {
        this._observer.destroy();
    }

    public static hasSession () : boolean {
        return !!this._emailToken?.token;
    }

    public static getEmailToken () : EmailTokenDTO | undefined {
        return this._emailToken;
    }

    public static getEmailAddress () : string | undefined {
        return this._emailToken?.email;
    }

    public static forgetToken () {
        this._setEmailToken(undefined);
    }

    public static async authenticateEmailAddress (
        email : string,
        language ?: Language
    ) : Promise<EmailTokenDTO> {
        if (this._emailToken) {
            this._setEmailToken(undefined);
        }
        return await EmailAuthHttpService.authenticateEmailAddress(email, language);
    }

    public static async verifyEmailToken (
        emailToken  : string,
        language   ?: Language
    ) : Promise<EmailTokenDTO | undefined> {
        const token : EmailTokenDTO | undefined = await EmailAuthHttpService.verifyEmailToken(emailToken, language)
        this._setEmailToken(token);
        return token;
    }

    public static async verifyEmailCode (
        token     : EmailTokenDTO,
        code      : string,
        language ?: Language
    ) : Promise<EmailTokenDTO | undefined> {
        const newToken : EmailTokenDTO | undefined = await EmailAuthHttpService.verifyEmailCode(token, code, language);
        this._setEmailToken(newToken);
        return newToken;
    }

    private static _setEmailToken (token : EmailTokenDTO | undefined ) {

        const storageKey : string = EmailAuthSessionService._localStorageKey;

        this._emailToken = token;

        if (token) {
            JsonLocalStorageService.setItem(storageKey, token as unknown as JsonAny);
        } else {
            JsonLocalStorageService.removeItem(storageKey);
        }

        this._observer.triggerEvent(EmailAuthSessionServiceEvent.EMAIL_TOKEN_UPDATED);

    }

    private static _getEmailTokenFromLocalStorage () : EmailTokenDTO | undefined {
        try {
            const storageKey : string = EmailAuthSessionService._localStorageKey;
            const token : any = JsonLocalStorageService.getItem(storageKey) || undefined;
            if (isEmailTokenDTO(token)) {
                return token;
            }
            return undefined;
        } catch (err) {
            LOG.error(`Could not parse localstorage token: `, err);
            return undefined;
        }
    }

}
