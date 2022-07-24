// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback } from "react";
import { LogService } from "../../../core/LogService";

const LOG = LogService.createLogger('useFieldChangeEventCallback');

export interface FieldChangeCallback<T> {
    (value: T): void;
}

/**
 *
 * @param identifier
 * @param change
 */
export function useFieldChangeCallback<T> (
    identifier: string,
    change: FieldChangeCallback<T> | undefined
) : FieldChangeCallback<T> {
    return useCallback(
        (value: T) => {
            if ( change ) {
                try {
                    LOG.debug(`${identifier}: Calling change callback on parent for value: `, value);
                    change(value);
                } catch (err) {
                    LOG.error(`${identifier}: Error: `, err);
                }
            } else {
                LOG.debug(`${identifier}: No change callback defined`);
            }
        },
        [
            identifier,
            change
        ]
    );
}
