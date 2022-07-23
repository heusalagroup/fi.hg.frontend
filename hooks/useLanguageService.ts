// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useEffect } from "react";
import { useTranslation, UseTranslationResponse } from "react-i18next";
import { parseLanguage } from "../../core/types/Language";
import { LanguageService } from "../../core/LanguageService";
import { TranslationUtils } from "../../core/utils/TranslationUtils";
import { LogService } from "../../core/LogService";

const LOG = LogService.createLogger('useLanguageService');

export function useLanguageService () : UseTranslationResponse<"translation"> {

    const translation = useTranslation();
    const i18n = translation?.i18n;
    const i18nLanguage = i18n?.language;

    // If language changes from i18n and/or when it's initializing
    useEffect(
        () => {
            const l = parseLanguage(i18nLanguage) ?? LanguageService.getDefaultLanguage();
            LanguageService.setCurrentLanguage(l);
        }, [
            i18nLanguage
        ]
    );

    // When language in our service changes
    useEffect(
        () => {
            return LanguageService.on(
                LanguageService.Event.CURRENT_LANGUAGE_CHANGED,
                () => {
                    const l = LanguageService.getCurrentLanguage();
                    const ls = TranslationUtils.getLanguageStringForI18n(l);
                    if ( !ls ) {
                        LOG.error(`Changing language: Could not parse language: ${l}`);
                    } else if ( i18n.language !== ls ) {
                        i18n.changeLanguage(ls).catch(err => {
                            LOG.error(`Changing language: Could not change language to "${ls}" (${l}": `, err);
                        });
                    } else {
                        LOG.debug(`The language was already ${ls}`);
                    }
                }
            );
        },
        [
            i18n
        ]
    );

    return translation;
}
