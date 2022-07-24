// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ChangeEvent, Dispatch, SetStateAction, useCallback } from "react";
import { FieldChangeCallback } from "../../../components/fields/FieldProps";
import { LogService } from "../../../../core/LogService";

const LOG = LogService.createLogger('useFieldChangeEventCallback');

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
    return useCallback(
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

            if ( event ) {
                event.preventDefault();
                event.stopPropagation();
            }

            const eventTargetValue = event?.target?.value ?? '';

            setValue(eventTargetValue);

            if ( change ) {
                try {
                    change(eventTargetValue);
                } catch (err) {
                    LOG.error(`${identifier}: Error: `, err);
                }
            }

        },
        [
            identifier,
            change,
            setValue
        ]
    );
}
