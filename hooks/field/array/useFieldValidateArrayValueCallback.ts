// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback } from "react";
import { LogService } from "../../../../core/LogService";
import { map } from "../../../../core/functions/map";
import { SelectFieldItem } from "../../../types/items/SelectFieldModel";

const LOG = LogService.createLogger('useFieldValidateArrayValueCallback');

export interface FieldValidateArrayValueCallback<T> {
    (
        internalValue: T | undefined,
        required: boolean
    ): boolean;
}

export function useFieldValidateArrayValueCallback<T> (
    identifier: string,
    propsValues: readonly SelectFieldItem<T>[] | undefined
): FieldValidateArrayValueCallback<T> {
    return useCallback(
        (
            internalValue: T | undefined,
            required: boolean
        ): boolean => {

            LOG.debug(`${identifier}: _validateValue: internalValue = `, internalValue);

            if ( internalValue === undefined ) {
                LOG.debug(`${identifier}: _validateValue: required = `, required);
                return !required;
            }

            const values : T[] = propsValues ? map(
                propsValues,
                (item: SelectFieldItem<T>): T => item.value
            ) : [];

            const matches: boolean = values.includes(internalValue);
            LOG.debug(`${identifier}: "${internalValue}": matches= `, matches, values);
            return matches;

        },
        [
            identifier,
            propsValues
        ]
    );
}
