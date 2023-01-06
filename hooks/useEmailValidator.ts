// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { VoidCallback } from "../../core/interfaces/callbacks";
import { useCallback, useEffect, useState } from "react";
import { trim } from "../../core/functions/trim";
import { EmailUtils } from "../../core/EmailUtils";

/**
 * Email address validator
 *
 * The name is limited to 10 characters because some programs will limit it if
 * longer, e.g. IRC nick will not work.
 *
 * @param value
 * @param required
 */
export function useEmailValidator (
    value: string | undefined,
    required: boolean = true
) : [boolean, VoidCallback] {

    const validateCallback = useCallback(
        (
            isRequired: boolean,
            value: string | undefined
        ) => {
            const valueString = trim(value ?? '');
            if (isRequired) {
                return !!valueString && EmailUtils.isEmailValid(valueString);
            } else {
                return (valueString?.length === 0) || EmailUtils.isEmailValid(valueString);
            }
        },
        [
        ]
    );

    const [isValid, setValid] = useState<boolean>( validateCallback(required, value) );

    const revalidateCallback = useCallback(
        () => {
            setValid( () => validateCallback(required, value));
        },
        [
            setValid,
            validateCallback,
            required,
            value
        ]
    );

    useEffect(
        () => {
            revalidateCallback();
        },
        [
            revalidateCallback,
            required,
            value
        ]
    );

    return [isValid, revalidateCallback];
}
