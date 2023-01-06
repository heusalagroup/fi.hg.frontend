// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useEffect, useState } from "react";
import { VoidCallback } from "../../core/interfaces/callbacks";
import { trim } from "../../core/functions/trim";

export function useAddressValidator (
    address: string | undefined,
    postCode: string | undefined,
    postName: string | undefined,
    country: string | undefined,
    required: boolean = true
) : [boolean, VoidCallback] {

    const validateCallback = useCallback(
        (
            isRequired: boolean,
            address: string | undefined,
            postCode: string | undefined,
            postName: string | undefined,
            country: string | undefined
        ) => {
            const addressString = trim(address ?? '');
            const postCodeString = trim(postCode ?? '');
            const postNameString = trim(postName ?? '');
            const countryString = trim(country ?? '');
            if (isRequired) {
                return !!addressString && !!postCodeString && !!postNameString && !!countryString;
            }
            return (!addressString && !postCodeString && !postNameString && !countryString) ? true : (!!addressString && !!postCodeString && !!postNameString && !!countryString);
        },
        [
        ]
    );

    const [isValid, setValid] = useState<boolean>( validateCallback(required, address, postCode, postName, country) );

    const revalidateCallback = useCallback(
        () => {
            setValid( () => validateCallback(required, address, postCode, postName, country));
        },
        [
            setValid,
            validateCallback,
            required,
            address,
            postCode,
            postName,
            country
        ]
    );

    useEffect(
        () => {
            revalidateCallback();
        },
        [
            revalidateCallback,
            required,
            address,
            postCode,
            postName,
            country
        ]
    );

    return [isValid, revalidateCallback];
}
