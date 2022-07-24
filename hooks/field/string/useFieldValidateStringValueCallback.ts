// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback } from "react";
import { LogService } from "../../../../core/LogService";

const LOG = LogService.createLogger('useFieldValidateStringValueCallback');

export interface FieldValidateStringValueCallback {
    (
        internalValue: string | undefined,
        required: boolean,
        minLength: number,
        maxLength: number | undefined
    ): boolean;
}

export function useFieldValidateStringValueCallback (
    identifier: string
): FieldValidateStringValueCallback {
    return useCallback(
        (
            internalValue: string | undefined,
            required: boolean,
            minLength: number,
            maxLength: number | undefined
        ): boolean => {

            LOG.debug(`${identifier}: _validateValue: internalValue = `, internalValue);

            if ( internalValue === undefined ) {
                LOG.debug(`${identifier}: _validateValue: required = `, required);
                return !required;
            }

            if ( required && minLength === 0 ) {
                minLength = 1;
            }

            const len = internalValue.length;
            LOG.debug(`${identifier}: _validateValue: len = `, len);
            LOG.debug(`${identifier}: _validateValue: minLength = `, minLength);
            LOG.debug(`${identifier}: _validateValue: maxLength = `, maxLength);

            if ( len < minLength ) return false;

            return !(maxLength !== undefined && len > maxLength);

        },
        [
            identifier
        ]
    );
}
