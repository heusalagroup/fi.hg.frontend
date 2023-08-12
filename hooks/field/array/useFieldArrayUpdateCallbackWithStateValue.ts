// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { Dispatch, SetStateAction, useCallback } from "react";
import { FormFieldState, stringifyFormFieldState } from "../../../types/FormFieldState";
import { LogService } from "../../../../core/LogService";
import { VoidCallback } from "../../../../core/interfaces/callbacks";
import { SelectFieldItem } from "../../../types/items/SelectFieldModel";
import { find } from "../../../../core/functions/find";
import { FieldValidateArrayValueCallbackWithStateValue } from "./useFieldValidateArrayValueCallbackWithStateValue";

const LOG = LogService.createLogger('useFieldArrayUpdateCallbackWithStateValue');

export function useFieldArrayUpdateCallbackWithStateValue<T> (
    identifier: string,
    fieldState: FormFieldState,
    setFieldState: Dispatch<SetStateAction<FormFieldState>>,
    propsValue: T | undefined,
    propsValues: readonly SelectFieldItem<T>[] | undefined,
    isRequired: boolean,
    validateValueCallback: FieldValidateArrayValueCallbackWithStateValue<T>
) : VoidCallback {
    return useCallback(
        () => {
            LOG.debug(`${identifier}: state: `, stringifyFormFieldState(fieldState));
            if ( fieldState < FormFieldState.MOUNTED ) return;
            if ( fieldState >= FormFieldState.UNMOUNTED ) return;
            setFieldState(() => {

                const item: SelectFieldItem<any> | undefined = (
                    propsValue === undefined || propsValues === undefined
                        ? undefined
                        : find(propsValues, (i: SelectFieldItem<any>) => i?.value === propsValue)
                );

                const isValid = validateValueCallback(
                    item?.value,
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
