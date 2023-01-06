// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useEffect, useState } from "react";
import { VoidCallback } from "../../core/interfaces/callbacks";
import { trim } from "../../core/functions/trim";
import { StringUtils } from "../../core/StringUtils";

export function useTextValidator (
    value: string | undefined,
    required: boolean = true,
    acceptedStartChars: string | undefined = undefined,
    acceptedMiddleChars: string | undefined = acceptedStartChars,
    acceptedEndChars: string | undefined = acceptedMiddleChars,
    minLength: number = 0,
    maxLength: number | undefined = undefined
) : [boolean, VoidCallback] {

    const validateCallback = useCallback(
        (
            isRequired: boolean,
            value: string | undefined,
            acceptedStartChars: string | undefined = undefined,
            acceptedMiddleChars: string | undefined = acceptedStartChars,
            acceptedEndChars: string | undefined = acceptedMiddleChars,
            minLength: number = 0,
            maxLength: number | undefined = undefined
        ) => {
            const valueString = trim(value ?? '');
            if (isRequired) {
                return !!valueString && StringUtils.validateStringCharacters(valueString, acceptedStartChars, acceptedMiddleChars, acceptedEndChars, minLength, maxLength);
            } else {
                return (valueString?.length === 0) || StringUtils.validateStringCharacters(valueString, acceptedStartChars, acceptedMiddleChars, acceptedEndChars, minLength, maxLength);
            }
        },
        [
        ]
    );

    const [isValid, setValid] = useState<boolean>( validateCallback(required, value, acceptedStartChars, acceptedMiddleChars, acceptedEndChars, minLength, maxLength) );

    const revalidateCallback = useCallback(
        () => {
            setValid( () => validateCallback(required, value, acceptedStartChars, acceptedMiddleChars, acceptedEndChars, minLength, maxLength));
        },
        [
            setValid,
            validateCallback,
            acceptedStartChars,
            acceptedMiddleChars,
            acceptedEndChars,
            required,
            value,
            minLength,
            maxLength
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
