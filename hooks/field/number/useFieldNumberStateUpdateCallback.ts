// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { Dispatch, SetStateAction, useCallback } from "react";
import { FormFieldState, stringifyFormFieldState } from "../../../types/FormFieldState";
import { LogService } from "../../../../core/LogService";
import { VoidCallback } from "../../../../core/interfaces/callbacks";
import { FieldValidateNumberWithStateValueCallback } from "./useFieldValidateNumberWithStateValueCallback";

const LOG = LogService.createLogger('useFieldNumberStateUpdateCallback');

export function useFieldNumberStateUpdateCallback (
    identifier: string,
    fieldState: FormFieldState,
    setFieldState: Dispatch<SetStateAction<FormFieldState>>,
    value: string,
    propsValue: number | undefined,
    isRequired: boolean,
    propsMinValue: number | undefined,
    propsMaxValue: number | undefined,
    validateWithStateValueCallback: FieldValidateNumberWithStateValueCallback
) : VoidCallback {
    return useCallback(
        () => {
            LOG.debug(`${identifier}: state: `, stringifyFormFieldState(fieldState));
            if ( fieldState < FormFieldState.MOUNTED ) return;
            if ( fieldState >= FormFieldState.UNMOUNTED ) return;
            setFieldState(() => {
                const isValid = validateWithStateValueCallback(                     // Validations and returns boolean
                    value,
                    propsValue,
                    isRequired,
                    propsMinValue ?? 0,
                    propsMaxValue
                );
                LOG.debug(`${identifier}: isValid: `, isValid);
                return isValid ? FormFieldState.VALID : FormFieldState.INVALID;
            });
        },
        [
            identifier,
            fieldState,
            value,
            propsValue,
            isRequired,
            propsMinValue,
            propsMaxValue,
            validateWithStateValueCallback,
            setFieldState
        ]
    );
}
