// Copyright (c) 2021-2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021-2023. Sendanor <info@sendanor.fi>. All rights reserved.

import { SmsTokenDTO, isSmsTokenDTO } from "../../core/auth/sms/types/SmsTokenDTO";
import { Observer, ObserverCallback, ObserverDestructor } from "../../core/Observer";
import { LogService } from "../../core/LogService";
import { Language } from "../../core/types/Language";
import { JsonAny } from "../../core/Json";
import { SmsAuthHttpService } from "../../core/SmsAuthHttpService";
import { JsonLocalStorageService } from "./JsonLocalStorageService";

const LOG = LogService.createLogger('SmsAuthSessionService');

export enum SmsAuthSessionServiceEvent {
    SMS_TOKEN_UPDATED     = "SmsAuthSessionService:smsTokenUpdated",
}

export type SmsAuthSessionServiceDestructor = ObserverDestructor;

export class SmsAuthSessionService {

    private static _localStorageKey : string = "fi.hg.auth.sms.session";
    private static _smsToken : SmsTokenDTO | undefined = SmsAuthSessionService._getSmsTokenFromLocalStorage();
    private static _observer: Observer<SmsAuthSessionServiceEvent> = new Observer<SmsAuthSessionServiceEvent>("SmsAuthSessionService");

    public static Event = SmsAuthSessionServiceEvent;

    public static setLocalStorageKey (key: string) {
        SmsAuthSessionService._localStorageKey = key;
        // FIXME: When this changes, we should try to read it from storage
    }

    public static on (
        name: SmsAuthSessionServiceEvent,
        callback: ObserverCallback<SmsAuthSessionServiceEvent>
    ): SmsAuthSessionServiceDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public static destroy (): void {
        this._observer.destroy();
    }

    public static hasSession () : boolean {
        return !!this._smsToken?.token;
    }

    public static getSmsToken () : SmsTokenDTO | undefined {
        return this._smsToken;
    }

    public static getSmsAddress () : string | undefined {
        return this._smsToken?.sms;
    }

    public static forgetToken () {
        this._setSmsToken(undefined);
    }

    public static async authenticateSmsAddress (
        sms : string,
        language ?: Language
    ) : Promise<SmsTokenDTO> {
        if (this._smsToken) {
            this._setSmsToken(undefined);
        }
        return await SmsAuthHttpService.authenticateSmsAddress(sms, language);
    }

    public static async verifySmsToken (
        smsToken  : SmsTokenDTO,
        language   ?: Language
    ) : Promise<SmsTokenDTO> {
        const token : SmsTokenDTO = await SmsAuthHttpService.verifySmsToken(smsToken, language)
        this._setSmsToken(token);
        return token;
    }

    public static async verifySmsCode (
        token     : SmsTokenDTO,
        code      : string,
        language ?: Language
    ) : Promise<SmsTokenDTO> {
        const newToken : SmsTokenDTO = await SmsAuthHttpService.verifySmsCode(token, code, language);
        this._setSmsToken(newToken);
        return newToken;
    }

    private static _setSmsToken (token : SmsTokenDTO | undefined ) {
        const storageKey : string = SmsAuthSessionService._localStorageKey;
        this._smsToken = token;
        if (token) {
            JsonLocalStorageService.setItem(storageKey, token as unknown as JsonAny);
        } else {
            JsonLocalStorageService.removeItem(storageKey);
        }
        this._observer.triggerEvent(SmsAuthSessionServiceEvent.SMS_TOKEN_UPDATED);
    }

    private static _getSmsTokenFromLocalStorage () : SmsTokenDTO | undefined {
        try {
            const storageKey : string = SmsAuthSessionService._localStorageKey;
            const token : any = JsonLocalStorageService.getItem(storageKey) || undefined;
            return isSmsTokenDTO(token) ? token : undefined;
        } catch (err) {
            LOG.error(`Could not parse localstorage token: `, err);
            return undefined;
        }
    }

}
