// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback } from "react";
import { ReadonlyJsonAny } from "../../../../core/Json";
import { FieldValidateStringValueCallback } from "../string/useFieldValidateStringValueCallback";

export interface GetInternalValueStringCallback {
    (value: ReadonlyJsonAny | undefined) : string;
}

export interface FieldValidateJsonValueCallback {
    (
        internalValue: ReadonlyJsonAny | undefined,
        required: boolean,
        minLength: number,
        maxLength: number | undefined
    ) : boolean;
}

export function useFieldValidateJsonValueCallback (
    validateStringValueCallback: FieldValidateStringValueCallback,
    getInternalValueString: GetInternalValueStringCallback
) : FieldValidateJsonValueCallback{
    return useCallback(
        (
            internalValue: ReadonlyJsonAny | undefined,
            required: boolean,
            minLength: number,
            maxLength: number | undefined
        ) : boolean => {
            return validateStringValueCallback(
                internalValue === undefined ? undefined : getInternalValueString(internalValue),
                required,
                minLength,
                maxLength
            );
        }, [
            validateStringValueCallback
        ]
    );
}
