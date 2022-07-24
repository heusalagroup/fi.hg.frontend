// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { Dispatch, SetStateAction, useCallback } from "react";
import { FormFieldState, stringifyFormFieldState } from "../../../types/FormFieldState";
import { LogService } from "../../../../core/LogService";
import { VoidCallback } from "../../../../core/interfaces/callbacks";
import { FieldValidateArrayValueCallback } from "./useFieldValidateArrayValueCallback";

const LOG = LogService.createLogger('useFieldArrayUpdateCallback');

export function useFieldArrayUpdateCallback<T> (
    identifier: string,
    fieldState: FormFieldState,
    setFieldState: Dispatch<SetStateAction<FormFieldState>>,
    propsValue: T | undefined,
    isRequired: boolean,
    validateValueCallback: FieldValidateArrayValueCallback<T>
) : VoidCallback {
    return useCallback(
        () => {
            LOG.debug(`${identifier}: state: `, stringifyFormFieldState(fieldState));
            if ( fieldState < FormFieldState.MOUNTED ) return;
            if ( fieldState >= FormFieldState.UNMOUNTED ) return;
            setFieldState(() => {
                const isValid = validateValueCallback(
                    propsValue,
                    isRequired
                );
                LOG.debug(`${identifier}: isValid: `, isValid);
                return isValid ? FormFieldState.VALID : FormFieldState.INVALID;
            });
        },
        [
            identifier,
            fieldState,
            propsValue,
            isRequired,
            validateValueCallback,
            setFieldState
        ]
    );
}
