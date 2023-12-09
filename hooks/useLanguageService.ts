// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useEffect } from "react";
import { useTranslation, UseTranslationResponse } from "react-i18next";
import { parseLanguage } from "../../core/types/Language";
import { LanguageService, LanguageServiceEvent } from "../../core/LanguageService";
import { TranslationUtils } from "../../core/TranslationUtils";
import { LogService } from "../../core/LogService";
import { useServiceEvent } from "./useServiceEvent";

const LOG = LogService.createLogger('useLanguageService');

export function useLanguageService (): UseTranslationResponse<"translation", undefined> {

    const translation = useTranslation();
    const i18n = translation?.i18n;
    const i18nLanguage = i18n?.language;
    const changeLanguage = i18n?.changeLanguage;

    const languageChangedEventCallback = useCallback(
        () => {
            const l = LanguageService.getCurrentLanguage();
            const ls = TranslationUtils.getLanguageStringForI18n(l);
            if ( !ls ) {
                LOG.error(`Could not parse language: ${l}`);
            } else if ( i18nLanguage !== ls ) {
                LOG.debug(`Asynchronously changing language as: ${ls}`);
                changeLanguage(ls).catch((err: any) => {
                    LOG.error(`Could not change language to "${ls}" (${l}": `, err);
                });
            } else {
                LOG.debug(`The language was already ${ls}`);
            }
        },
        [
            i18nLanguage,
            changeLanguage
        ]
    );

    // If language changes from i18n and/or when it's initializing
    useEffect(
        () => {
            const l = parseLanguage(i18nLanguage) ?? LanguageService.getDefaultLanguage();
            LOG.debug(`Selecting language as `, l);
            LanguageService.setCurrentLanguage(l);
        },
        [
            i18nLanguage
        ]
    );

    // When language in our service changes
    useServiceEvent(
        LanguageService,
        LanguageServiceEvent.CURRENT_LANGUAGE_CHANGED,
        languageChangedEventCallback
    );

    return translation;
}
