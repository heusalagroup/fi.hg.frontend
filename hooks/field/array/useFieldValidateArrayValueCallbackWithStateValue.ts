// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback } from "react";
import { LogService } from "../../../../core/LogService";
import { FieldValidateArrayValueCallback } from "./useFieldValidateArrayValueCallback";

const LOG = LogService.createLogger('useFieldValidateArrayValueCallbackWithStateValue');

export interface FieldValidateArrayValueCallbackWithStateValue<T> {
    (
        internalValue: T | undefined,
        propValue: T | undefined,
        required: boolean
    ): boolean;
}

export function useFieldValidateArrayValueCallbackWithStateValue<T> (
    identifier: string,
    validateValueCallback: FieldValidateArrayValueCallback<T>
): FieldValidateArrayValueCallbackWithStateValue<T> {
    return useCallback(
        (
            internalValue: T | undefined,
            propValue: T | undefined,
            required: boolean
        ): boolean => {

            LOG.debug(`${identifier}: internalValue = `, internalValue);

            if ( !validateValueCallback(propValue, required) ) {
                LOG.debug(`${identifier}: propValue = `, propValue);
                return false;
            }

            const parsedStateValue: any | undefined = internalValue;
            LOG.debug(`${identifier}: parsedStateValue = `, parsedStateValue);

            if ( parsedStateValue === undefined && !!internalValue ) {
                return false;
            }

            if ( !validateValueCallback(parsedStateValue, required) ) {
                return false;
            }

            LOG.debug(`${identifier}: propValue = `, propValue);
            return parsedStateValue === propValue;

        },
        [
            identifier,
            validateValueCallback
        ]
    );
}
