// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { EmailTokenDTO, isEmailTokenDTO } from "../../core/auth/email/types/EmailTokenDTO";
import { Language } from "../../core/types/Language";
import { LanguageService } from "../../core/LanguageService";
import { HttpService } from "../../core/HttpService";
import { LogService } from "../../core/LogService";
import { VerifyEmailCodeDTO } from "../../core/auth/email/types/VerifyEmailCodeDTO";
import { ReadonlyJsonAny } from "../../core/Json";
import { CallbackWithLanguage, AUTHENTICATE_EMAIL_URL, VERIFY_EMAIL_CODE_URL, VERIFY_EMAIL_TOKEN_URL } from "../../core/auth/email/constants";

const LOG = LogService.createLogger('EmailAuthHttpService');

export class EmailAuthHttpService {

    private static _authenticateEmailUrl : CallbackWithLanguage = AUTHENTICATE_EMAIL_URL;
    private static _verifyEmailCodeUrl   : CallbackWithLanguage = VERIFY_EMAIL_CODE_URL;
    private static _verifyEmailTokenUrl  : CallbackWithLanguage = VERIFY_EMAIL_TOKEN_URL;

    public static initialize (
        authenticateEmailUrl : CallbackWithLanguage = AUTHENTICATE_EMAIL_URL,
        verifyEmailCodeUrl   : CallbackWithLanguage = VERIFY_EMAIL_CODE_URL,
        verifyEmailTokenUrl  : CallbackWithLanguage = VERIFY_EMAIL_TOKEN_URL
    ) {
        this._authenticateEmailUrl = authenticateEmailUrl;
        this._verifyEmailCodeUrl = verifyEmailCodeUrl;
        this._verifyEmailTokenUrl = verifyEmailTokenUrl;
    }

    public static async authenticateEmailAddress (
        email : string,
        language ?: Language
    ) : Promise<EmailTokenDTO> {
        const lang : Language = language ?? LanguageService.getCurrentLanguage();
        const item = await HttpService.postJson(this._authenticateEmailUrl(lang), {
            email
        });
        if (!isEmailTokenDTO(item)) {
            LOG.debug(`Response: `, item);
            throw new TypeError(`Response was not EmailTokenDTO`);
        }
        return item;
    }

    public static async verifyEmailToken (
        emailToken : string,
        language ?: Language
    ) : Promise<EmailTokenDTO | undefined> {
        const lang : Language = language ?? LanguageService.getCurrentLanguage();
        const response : any = await HttpService.postJson(this._verifyEmailTokenUrl(lang), {
            emailToken
        });
        const token : EmailTokenDTO | undefined = response;
        return token && isEmailTokenDTO(token) ? token : undefined;
    }

    public static async verifyEmailCode (
        token : EmailTokenDTO,
        code: string,
        language ?: Language
    ) : Promise<EmailTokenDTO | undefined> {
        const lang : Language = language ?? LanguageService.getCurrentLanguage();
        const body : VerifyEmailCodeDTO = {
            token,
            code
        } as VerifyEmailCodeDTO;
        const response : any = await HttpService.postJson(this._verifyEmailTokenUrl(lang), body as unknown as ReadonlyJsonAny);
        const newToken : EmailTokenDTO | undefined = response;
        return newToken && isEmailTokenDTO(newToken) ? newToken : undefined;
    }

}
