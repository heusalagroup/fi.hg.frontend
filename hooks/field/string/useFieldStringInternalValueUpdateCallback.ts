// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { Dispatch, SetStateAction, useCallback } from "react";
import { LogService } from "../../../../core/LogService";
import { VoidCallback } from "../../../../core/interfaces/callbacks";

const LOG = LogService.createLogger('useFieldStringInternalValueUpdateCallback');

export function useFieldStringInternalValueUpdateCallback (
    identifier: string,
    setValue: Dispatch<SetStateAction<string>>,
    propsValue: string | undefined
) : VoidCallback {
    return useCallback(
        () => {
            LOG.debug(`${identifier}: Changing internal value: `, propsValue);
            setValue(() => propsValue ?? '');
        }, [
            identifier,
            propsValue,
            setValue
        ]
    );
}
