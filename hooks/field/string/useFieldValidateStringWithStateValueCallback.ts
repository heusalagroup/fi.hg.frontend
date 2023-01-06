// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback } from "react";
import { LogService } from "../../../../core/LogService";
import { FieldValidateStringValueCallback } from "./useFieldValidateStringValueCallback";
import { trim } from "../../../../core/functions/trim";

const LOG = LogService.createLogger('useFieldValidateStringWithStateValueCallback');

export interface FieldValidateStringWithStateValueCallback {
    (
        stateValueString: string,
        propValue: string | undefined,
        required: boolean,
        minLength: number,
        maxLength: number | undefined
    ): boolean;
}

export function useFieldValidateStringWithStateValueCallback (
    identifier: string,
    validateValueCallback : FieldValidateStringValueCallback
) : FieldValidateStringWithStateValueCallback {

    return useCallback(
        (
            stateValueString: string,
            propValue: string | undefined,
            required: boolean,
            minLength: number,
            maxLength: number | undefined
        ): boolean => {

            LOG.debug(`${identifier}: _validateWithStateValue: stateValueString = `, stateValueString);

            if ( !validateValueCallback(propValue, required, minLength, maxLength) ) {
                LOG.debug(`${identifier}: _validateWithStateValue: propValue = `, propValue);
                return false;
            }

            const parsedStateValue: string = trim(stateValueString);
            LOG.debug(`${identifier}: _validateWithStateValue: parsedStateValue = `, parsedStateValue);

            if ( parsedStateValue === '' && stateValueString.length >= 1 ) {
                return false;
            }

            if ( !validateValueCallback(parsedStateValue, required, minLength, maxLength) ) {
                return false;
            }

            LOG.debug(`${identifier}: _validateWithStateValue: propValue = `, propValue);
            return parsedStateValue === (propValue ?? '');

        },
        [
            identifier,
            validateValueCallback
        ]
    );
}
