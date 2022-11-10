// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ChangeEvent, Dispatch, SetStateAction, useCallback } from "react";
import { FieldChangeCallback, useFieldChangeCallback } from "../useFieldChangeCallback";

/**
 *
 * @param identifier
 * @param setValue
 * @param change
 */
export function useFieldFileChangeEventCallback (
    identifier: string,
    setValue: Dispatch<SetStateAction<FileList | null>>,
    change: FieldChangeCallback<FileList | null> | undefined
) {
    const changeCallback = useFieldChangeCallback<FileList | null>(identifier, change);
    return useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            if ( event ) {
                event.preventDefault();
                event.stopPropagation();
            }
            const eventTargetValue = event?.target?.files;
            setValue(eventTargetValue);
            changeCallback(eventTargetValue);
        },
        [
            changeCallback,
            setValue
        ]
    );
}
