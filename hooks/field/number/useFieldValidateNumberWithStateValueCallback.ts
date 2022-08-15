// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback } from "react";
import { LogService } from "../../../../core/LogService";
import { FieldValidateNumberValueCallback } from "./useFieldValidateNumberValueCallback";
import { ToNumberCallback } from "../useNumberField";

const LOG = LogService.createLogger('useFieldValidateNumberWithStateValueCallback');

export interface FieldValidateNumberWithStateValueCallback {
    (
        stateValueString: string,
        propValue: number | undefined,
        required: boolean,
        minValue: number | undefined,
        maxValue: number | undefined
    ): boolean;
}

export function useFieldValidateNumberWithStateValueCallback (
    identifier: string,
    validateValueCallback : FieldValidateNumberValueCallback,
    toNumber: ToNumberCallback
) : FieldValidateNumberWithStateValueCallback {
    return useCallback(                                        
        (
            stateValueString: string,
            propValue: number | undefined,
            required: boolean,
            minValue: number | undefined,
            maxValue: number | undefined
        ): boolean => {

            LOG.debug(`${identifier}: _validateWithStateValue: stateValueString = `, stateValueString);

            if ( !validateValueCallback(propValue, required, minValue, maxValue) ) {         // if validateValueCallback returns false
                LOG.debug(`${identifier}: _validateWithStateValue: propValue = `, propValue);
                return false;
            }

            const parsedStateValue: number | undefined = toNumber(stateValueString);
            LOG.debug(`${identifier}: _validateWithStateValue: parsedStateValue = `, parsedStateValue);

            if ( parsedStateValue === undefined && stateValueString.length >= 1 ) {
                return false;
            }

            if ( !validateValueCallback(parsedStateValue, required, minValue, maxValue) ) {
                return false;
            }

            LOG.debug(`${identifier}: _validateWithStateValue: propValue = `, propValue);
            return parsedStateValue === propValue && (`${propValue ?? ''}` === stateValueString);

        },
        [
            identifier,
            validateValueCallback,
            toNumber
        ]
    );
}
