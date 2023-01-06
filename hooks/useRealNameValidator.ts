// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useEffect, useState } from "react";
import { VoidCallback } from "../../core/interfaces/callbacks";
import { trim } from "../../core/functions/trim";

export function useRealNameValidator (
    firstName: string | undefined,
    lastName : string | undefined,
    required: boolean = true
) : [boolean, VoidCallback] {

    const validateCallback = useCallback(
        (
            isRequired: boolean,
            firstName: string | undefined,
            lastName: string | undefined
        ) => {
            const firstNameString = trim(firstName ?? '');
            const lastNameString = trim(lastName ?? '');
            if (isRequired) {
                return !!firstNameString && !!lastNameString;
            } else {
                return (!firstNameString && !lastNameString) ? true : (!!firstNameString && !!lastNameString);
            }
        },
        [
        ]
    );

    const [isValid, setValid] = useState<boolean>( validateCallback(required, firstName, lastName) );

    const revalidateCallback = useCallback(
        () => {
            setValid( () => validateCallback(required, firstName, lastName));
        },
        [
            setValid,
            validateCallback,
            required,
            firstName,
            lastName
        ]
    );

    useEffect(
        () => {
            revalidateCallback();
        },
        [
            revalidateCallback,
            required,
            firstName,
            lastName
        ]
    );

    return [isValid, revalidateCallback];
}
