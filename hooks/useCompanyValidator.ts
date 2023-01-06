// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useEffect, useState } from "react";
import { VoidCallback } from "../../core/interfaces/callbacks";
import { trim } from "../../core/functions/trim";

/**
 * @param name
 * @param businessId
 * @param required
 */
export function useCompanyValidator (
    name: string | undefined,
    businessId : string | undefined,
    required: boolean = true
) : [boolean, VoidCallback] {

    const validateCallback = useCallback(
        (
            isRequired: boolean,
            name: string | undefined,
            businessId: string | undefined
        ) => {
            const nameString = trim(name ?? '');
            const businessIdString = trim(businessId ?? '');
            if (isRequired) {
                return !!nameString && !!businessIdString;
            } else {
                return (!nameString && !businessIdString) ? true : (!!nameString && !!businessIdString);
            }
        },
        [
        ]
    );

    const [isValid, setValid] = useState<boolean>( validateCallback(required, name, businessId) );

    const revalidateCallback = useCallback(
        () => {
            setValid( () => validateCallback(required, name, businessId));
        },
        [
            setValid,
            validateCallback,
            required,
            name,
            businessId
        ]
    );

    useEffect(
        () => {
            revalidateCallback();
        },
        [
            revalidateCallback,
            required,
            name,
            businessId
        ]
    );

    return [isValid, revalidateCallback];
}
