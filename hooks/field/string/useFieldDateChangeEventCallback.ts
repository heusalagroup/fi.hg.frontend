// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { Dispatch, SetStateAction, useCallback } from "react";
import { moment } from "../../../../core/modules/moment";
import { FieldChangeCallback, useFieldChangeCallback } from "../useFieldChangeCallback";

export function useFieldDateChangeEventCallback (
    identifier: string,
    setValue: Dispatch<SetStateAction<string>>,
    change: FieldChangeCallback<string | undefined> | undefined,
    dateFormat?: string
) {
    const changeCallback = useFieldChangeCallback<string>(identifier, change);
    return useCallback(
        (value: string) => {
            const eventTargetValue = moment(value).format(dateFormat) ?? '';
            setValue(eventTargetValue);
            changeCallback(eventTargetValue);
        },
        [
            dateFormat,
            changeCallback,
            setValue
        ]
    );
}
