// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback } from "react";
import { LogService } from "../../../../core/LogService";
import { FieldChangeCallback } from "../useFieldChangeCallback";
import { SelectFieldItem } from "../../../types/items/SelectFieldModel";
import { VoidCallback } from "../../../../core/interfaces/callbacks";

const LOG = LogService.createLogger('useSelectItemCallback');

export interface SelectItemCallback {
    (index: number) : void;
}

export function useSelectItemCallback<T> (
    identifier: string,
    propsValues : readonly SelectFieldItem<T>[] | undefined,
    changeCallback: FieldChangeCallback<T>,
    closeDropdownCallback ?: VoidCallback
) : SelectItemCallback {
    return useCallback(
        (index: number) => {
            LOG.debug(`${identifier}: Selecting index: `, index);
            if ( propsValues !== undefined && index >= 0 && index < propsValues.length ) {
                changeCallback(propsValues[index]?.value);
                if (closeDropdownCallback) {
                    closeDropdownCallback();
                }
            } else {
                LOG.error(`${identifier}: Index out of range: `, index);
            }
        },
        [
            identifier,
            propsValues,
            changeCallback,
            closeDropdownCallback
        ]
    );
}
