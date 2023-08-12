// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { Dispatch, SetStateAction, useCallback } from "react";
import { FormFieldState, stringifyFormFieldState } from "../../../types/FormFieldState";
import { LogService } from "../../../../core/LogService";
import { VoidCallback } from "../../../../core/interfaces/callbacks";
import { CountryCode } from "../../../../core/types/CountryCode";
import { FieldValidateCountryCodeWithStateValueCallback } from "./useFieldValidateCountryCodeWithStateValueCallback";

const LOG = LogService.createLogger('useFieldCountryCodeStateUpdateCallback');

export function useFieldCountryCodeStateUpdateCallback (
    identifier: string,
    fieldState: FormFieldState,
    setFieldState: Dispatch<SetStateAction<FormFieldState>>,
    value: string,
    propsValue: CountryCode | undefined,
    isRequired: boolean,
    validateWithStateValueCallback: FieldValidateCountryCodeWithStateValueCallback
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
                    isRequired
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
            validateWithStateValueCallback,
            setFieldState
        ]
    );
}
