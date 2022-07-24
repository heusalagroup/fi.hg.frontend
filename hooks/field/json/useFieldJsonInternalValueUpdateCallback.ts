// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { Dispatch, SetStateAction, useCallback } from "react";
import { LogService } from "../../../../core/LogService";
import { VoidCallback } from "../../../../core/interfaces/callbacks";
import { ReadonlyJsonAny } from "../../../../core/Json";
import { GetInternalValueStringCallback } from "./useFieldValidateJsonValueCallback";

const LOG = LogService.createLogger('useFieldJsonInternalValueUpdateCallback');

export function useFieldJsonInternalValueUpdateCallback (
    identifier: string,
    setValue: Dispatch<SetStateAction<string>>,
    propsValue: ReadonlyJsonAny | undefined,
    getInternalValueString: GetInternalValueStringCallback
) : VoidCallback {
    return useCallback(
        () => {
            LOG.debug(`${identifier}: Changing internal value: `, propsValue);
            setValue(() => getInternalValueString(propsValue));
        }, [
            identifier,
            propsValue,
            setValue
        ]
    );
}
