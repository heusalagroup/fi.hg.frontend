// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback } from "react";
import { LogService } from "../../../../core/LogService";

const LOG = LogService.createLogger('useFieldValidateNumberValueCallback');

export interface FieldValidateNumberValueCallback {
    (
        internalValue: number | undefined,
        required: boolean,
        minLength: number | undefined,
        maxLength: number | undefined
    ): boolean;
}

export function useFieldValidateNumberValueCallback (
    identifier: string
): FieldValidateNumberValueCallback {
    return useCallback(
        (
            internalValue: number | undefined,
            required: boolean,
            minValue: number | undefined,
            maxValue: number | undefined
        ): boolean => {
            LOG.debug(`${identifier}: internalValue = `, internalValue);
            if ( internalValue === undefined ) {
                LOG.debug(`${identifier}: required = `, required);
                return !required;
            }
            if (minValue !== undefined && internalValue < minValue) {
                return false;
            }
            return !(maxValue !== undefined && internalValue > maxValue);
        },
        [
            identifier
        ]
    );
}
