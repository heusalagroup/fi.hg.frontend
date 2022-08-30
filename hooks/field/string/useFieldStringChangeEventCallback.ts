// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ChangeEvent, Dispatch, SetStateAction, useCallback } from "react";
import { TimeService } from "../../../../core/TimeService";
import { FieldChangeCallback, useFieldChangeCallback } from "../useFieldChangeCallback";

/**
 *
 * @param identifier
 * @param setValue
 * @param change
 */
export function useFieldStringChangeEventCallback (
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
            const eventTargetValue = event?.target?.value ?? '';
            setValue(eventTargetValue);
            changeCallback(eventTargetValue);
        },
        [
            changeCallback,
            setValue
        ]
    );
}

export function useFieldDateChangeEventCallback (       // Had trouble calling from own component
    identifier: string,
    setValue: Dispatch<SetStateAction<string>>,
    change: FieldChangeCallback<string | undefined> | undefined,
    dateFormat?: string
) {
    const changeCallback = useFieldChangeCallback<string>(identifier, change);

    return useCallback(
        (value: string) => {
            const eventTargetValue = TimeService.momentEntity(value).format(dateFormat) ?? '';
            setValue(eventTargetValue);
            changeCallback(eventTargetValue);
        },
        [
            changeCallback,
            setValue
        ]
    );
}
