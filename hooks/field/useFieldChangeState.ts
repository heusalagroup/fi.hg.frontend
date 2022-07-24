// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useEffect } from "react";
import { LogService } from "../../../core/LogService";
import { FormFieldState } from "../../types/FormFieldState";
import { FieldChangeCallback } from "./useFieldChangeCallback";

const LOG = LogService.createLogger('useFieldChangeState');

/** Call `changeState` if `fieldState` changes
 *
 * @param changeState
 * @param fieldState
 */
export function useFieldChangeState (
    changeState : FieldChangeCallback<FormFieldState> | undefined,
    fieldState : FormFieldState
) : void {
    useEffect(
        () => {
            LOG.debug(`Calling changeState on fieldState change: `, fieldState);
            if ( changeState ) {
                changeState(fieldState);
            }
        },
        [
            changeState,
            fieldState
        ]
    );
}
