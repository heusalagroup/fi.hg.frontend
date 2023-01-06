// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback } from "react";
import { LogService } from "../../../../core/LogService";
import { isEqual } from "../../../../core/functions/isEqual";
import { parseJson, ReadonlyJsonAny } from "../../../../core/Json";
import { FieldValidateJsonValueCallback } from "./useFieldValidateJsonValueCallback";

const LOG = LogService.createLogger('useFieldValidateWithStateValue');

export interface FieldValidateJsonWithStateValueCallback {
    (
        stateValueString: string,
        propValue: ReadonlyJsonAny | undefined,
        required: boolean,
        minLength: number,
        maxLength: number | undefined
    ): boolean;
}

export function useFieldValidateJsonWithStateValueCallback (
    identifier: string,
    validateValueCallback : FieldValidateJsonValueCallback
) : FieldValidateJsonWithStateValueCallback {
    return useCallback(
        (
            stateValueString: string,
            propValue: ReadonlyJsonAny | undefined,
            required: boolean,
            minLength: number,
            maxLength: number | undefined
        ): boolean => {

            LOG.debug(`${identifier}: _validateWithStateValue: stateValueString = `, stateValueString);

            if ( !validateValueCallback(propValue, required, minLength, maxLength) ) {
                LOG.debug(`${identifier}: _validateWithStateValue: propValue = `, propValue);
                return false;
            }

            const parsedStateValue: ReadonlyJsonAny | undefined = parseJson(stateValueString) as ReadonlyJsonAny | undefined;
            LOG.debug(`${identifier}: _validateWithStateValue: parsedStateValue = `, parsedStateValue);

            if ( parsedStateValue === undefined && stateValueString.length >= 1 ) {
                return false;
            }

            if ( !validateValueCallback(parsedStateValue, required, minLength, maxLength) ) {
                return false;
            }

            LOG.debug(`${identifier}: _validateWithStateValue: propValue = `, propValue);
            return isEqual(parsedStateValue, propValue);

        },
        [
            identifier,
            validateValueCallback
        ]
    );
}
