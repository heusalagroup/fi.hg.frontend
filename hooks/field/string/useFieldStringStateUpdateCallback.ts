// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { Dispatch, SetStateAction, useCallback } from "react";
import { FormFieldState, stringifyFormFieldState } from "../../../types/FormFieldState";
import { LogService } from "../../../../core/LogService";
import { FieldValidateStringWithStateValueCallback } from "./useFieldValidateStringWithStateValueCallback";
import { VoidCallback } from "../../../../core/interfaces/callbacks";

const LOG = LogService.createLogger('useFieldStringStateUpdateCallback');

export function useFieldStringStateUpdateCallback (
    identifier: string,
    fieldState: FormFieldState,
    setFieldState: Dispatch<SetStateAction<FormFieldState>>,
    value: string,
    propsValue: string | undefined,
    isRequired: boolean,
    propsMinLength: number | undefined,
    propsMaxLength: number | undefined,
    validateWithStateValueCallback: FieldValidateStringWithStateValueCallback
) : VoidCallback {
    return useCallback(
        () => {
            LOG.debug(`${identifier}: state: `, stringifyFormFieldState(fieldState));
            if ( fieldState < FormFieldState.MOUNTED ) return;
            if ( fieldState >= FormFieldState.UNMOUNTED ) return;
            setFieldState(() => {
                const isValid = validateWithStateValueCallback(
                    value,
                    propsValue,
                    isRequired,
                    propsMinLength ?? 0,
                    propsMaxLength
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
            propsMinLength,
            propsMaxLength,
            validateWithStateValueCallback,
            setFieldState
        ]
    );
}
