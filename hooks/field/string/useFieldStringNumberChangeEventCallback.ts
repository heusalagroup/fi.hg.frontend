// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ChangeEvent, Dispatch, SetStateAction, useCallback } from "react";
import { FieldChangeCallback, useFieldChangeCallback } from "../useFieldChangeCallback";

/**
 *
 * @param identifier
 * @param setValue
 * @param change
 */
export function useFieldStringNumberChangeEventCallback (
    identifier: string,
    setValue: Dispatch<SetStateAction<string>>,
    change: FieldChangeCallback<string | undefined> | undefined
) {
    const changeCallback = useFieldChangeCallback<string>(identifier, change);
    return useCallback(
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if ( event ) {
                event.preventDefault();
                event.stopPropagation();
            }
            const eventTargetValue = (
                (event?.target?.value ?? '')
                .replace(',', '.')
                .replace(/ +/g, '')
            );
            setValue(eventTargetValue);
            changeCallback(eventTargetValue);
        },
        [
            changeCallback,
            setValue
        ]
    );
}