// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { Dispatch, SetStateAction, useCallback } from "react";
import { LogService } from "../../../../core/LogService";
import { VoidCallback } from "../../../../core/interfaces/callbacks";
import { StringifyNumberCallback } from "../useNumberField";

const LOG = LogService.createLogger('useFieldDecimalNumberInternalValueUpdateCallback');

export function useFieldDecimalNumberInternalValueUpdateCallback (
    identifier: string,
    setValue: Dispatch<SetStateAction<string>>,
    propsValue: number | undefined,
    stringifyNumber: StringifyNumberCallback
) : VoidCallback {
    return useCallback(
        () => {
            LOG.debug(`${identifier}: Changing internal value: `, propsValue);

            setValue((prevValue: string) => {
                return prevValue;
            });
        }, [
            identifier,
            propsValue,
            stringifyNumber,
            setValue
        ]
    );
}
