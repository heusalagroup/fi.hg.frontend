// Copyright (c) 2021. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useEffect, useState } from "react";
import { LogService } from "../../core/LogService";
import { isFunction } from "../../core/types/Function";

const LOG = LogService.createLogger('useFormValidator');

export interface FormValidationCheckCallback {
    (): boolean;
}

export interface FormValidateCallback {
    (): boolean;
}

export interface FormValidationState {
    readonly isValid: boolean;
    readonly isVerbose: boolean;
}

export function createFormValidationState(
    isValid: boolean,
    isVerbose: boolean
): FormValidationState {
    return {
        isValid,
        isVerbose
    };
}

export function useFormValidator(
    validate: FormValidationCheckCallback | boolean
): [FormValidationState, FormValidateCallback] {

    const validateCheck = useCallback(
        (): boolean => {
            return (isFunction(validate) ? validate() : validate) === true;
        },
        [
            validate
        ]
    );

    const [formValidationState, setFormValidationState] = useState<FormValidationState>(
        createFormValidationState(validateCheck(), false)
    );

    const validateCallback = useCallback(
        (): boolean => {
            const v = validateCheck();
            LOG.debug(`valideting as: `, v);
            if (!v) {
                setFormValidationState(() => createFormValidationState(validateCheck(), true));
            }
            return v;
        },
        [
            validateCheck,
            setFormValidationState
        ]
    );

    useEffect(
        () => {
            if (validateCheck()) {
                setFormValidationState((value) => createFormValidationState(validateCheck(), value.isVerbose));
            }
        },
        [
            setFormValidationState,
            validateCheck
        ]
    );

    return [formValidationState, validateCallback];

}


