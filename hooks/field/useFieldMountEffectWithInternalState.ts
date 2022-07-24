// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { Dispatch, SetStateAction, useCallback } from "react";
import { FormFieldState } from "../../types/FormFieldState";
import { useMountEffect } from "../useMountEffect";
import { VoidCallback } from "../../../core/interfaces/callbacks";

export function useFieldMountEffectWithInternalState (
    identifier: string,
    setFieldState: Dispatch<SetStateAction<FormFieldState>>,
    updateValueStateCallback: VoidCallback,
    updateFieldStateCallback: VoidCallback
) {

    const mountCallback = useCallback(
        () => {
            updateValueStateCallback();
            setFieldState(FormFieldState.MOUNTED);
            updateFieldStateCallback();
        },
        [
            setFieldState,
            updateValueStateCallback,
            updateFieldStateCallback
        ]
    );

    const unmountCallback = useCallback(
        () => {
            setFieldState(FormFieldState.UNMOUNTED);
        },
        [
            setFieldState
        ]
    );

    useMountEffect(
        identifier,
        mountCallback,
        unmountCallback
    );

}
