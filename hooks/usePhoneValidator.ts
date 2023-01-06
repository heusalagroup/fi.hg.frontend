// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useEffect, useState } from "react";
import { VoidCallback } from "../../core/interfaces/callbacks";
import { trim } from "../../core/functions/trim";
import { PhoneNumberUtils } from "../../core/PhoneNumberUtils";

export function usePhoneValidator (
    phoneNumber: string | undefined,
    required: boolean = true
) : [boolean, VoidCallback] {

    const validateCallback = useCallback(
        (
            isRequired: boolean,
            phoneNumber: string | undefined
        ) => {
            const phoneNumberString = trim(phoneNumber ?? '');
            if (isRequired) return PhoneNumberUtils.validatePhoneNumber( phoneNumberString );
            return !phoneNumberString ? true : PhoneNumberUtils.validatePhoneNumber( phoneNumberString );
        },
        [
        ]
    );

    const [isValid, setValid] = useState<boolean>( validateCallback(required, phoneNumber) );

    const revalidateCallback = useCallback(
        () => {
            setValid( () => validateCallback(required, phoneNumber));
        },
        [
            setValid,
            validateCallback,
            required,
            phoneNumber
        ]
    );

    useEffect(
        () => {
            revalidateCallback();
        },
        [
            revalidateCallback,
            required,
            phoneNumber
        ]
    );

    return [isValid, revalidateCallback];
}
