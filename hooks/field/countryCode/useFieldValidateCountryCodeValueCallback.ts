// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback } from "react";
import { LogService } from "../../../../core/LogService";
import { CountryCode, isCountryCode } from "../../../../core/types/CountryCode";

const LOG = LogService.createLogger('useFieldValidateCountryCodeValueCallback');

export interface FieldValidateCountryCodeValueCallback {
    (
        internalValue: CountryCode | undefined,
        required: boolean
    ): boolean;
}

export function useFieldValidateCountryCodeValueCallback (
    identifier: string
): FieldValidateCountryCodeValueCallback {
    return useCallback(
        (
            internalValue: CountryCode | undefined,
            required: boolean
        ): boolean => {
            LOG.debug(`${identifier}: internalValue = `, internalValue);
            if ( internalValue === undefined ) {
                LOG.debug(`${identifier}: required = `, required);
                return !required;
            }
            return isCountryCode(internalValue);
        },
        [
            identifier
        ]
    );
}
