// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback } from "react";
import { LogService } from "../../../../core/LogService";
import { FieldValidateCountryCodeValueCallback } from "./useFieldValidateCountryCodeValueCallback";
import { CountryCode, parseCountryCode } from "../../../../core/types/CountryCode";

const LOG = LogService.createLogger('useFieldValidateCountryCodeWithStateValueCallback');

export interface FieldValidateCountryCodeWithStateValueCallback {
    (
        stateValueString: string,
        propValue: CountryCode | undefined,
        required: boolean
    ): boolean;
}

export function useFieldValidateCountryCodeWithStateValueCallback (
    identifier: string,
    validateValueCallback : FieldValidateCountryCodeValueCallback
) : FieldValidateCountryCodeWithStateValueCallback {
    return useCallback(
        (
            stateValueString: string,
            propValue: CountryCode | undefined,
            required: boolean
        ): boolean => {
            LOG.debug(`${identifier}: _validateWithStateValue: stateValueString = `, stateValueString);
            if ( !validateValueCallback(propValue, required) ) {
                LOG.debug(`${identifier}: _validateWithStateValue: propValue = `, propValue);
                return false;
            }
            const parsedStateValue: CountryCode | undefined = parseCountryCode(stateValueString);
            LOG.debug(`${identifier}: _validateWithStateValue: parsedStateValue = `, parsedStateValue);
            return validateValueCallback(parsedStateValue, required);
        },
        [
            identifier,
            validateValueCallback
        ]
    );
}
