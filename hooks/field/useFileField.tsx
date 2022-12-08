// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import {
    ChangeEvent,
    KeyboardEvent,
    RefObject,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import { FormFieldState } from "../../types/FormFieldState";
import { useFieldChangeState } from "./useFieldChangeState";
import { LogService } from "../../../core/LogService";
import { useFieldIdentifier } from "./useFieldIdentifier";
import { SelectFieldItem } from "../../types/items/SelectFieldModel";
import { findIndex, some } from "../../../core/modules/lodash";
import { useFieldValidateArrayValueCallback } from "./array/useFieldValidateArrayValueCallback";
import { useFieldArrayUpdateCallback } from "./array/useFieldArrayUpdateCallback";
import { FieldChangeCallback, useFieldChangeCallback } from "./useFieldChangeCallback";
import { useDelayedCallback } from "../useDelayedCallback";
import { useMountEffect } from "../useMountEffect";
import { useSelectItemCallback } from "./array/useSelectItemCallback";

const LOG = LogService.createLogger('useFileField');

export function useFileField<T> (
    label: string,
    key: string,
    change: FieldChangeCallback<T | undefined> | undefined,
    changeState: FieldChangeCallback<FormFieldState> | undefined,
    isRequired: boolean,
    propsValue: T | undefined,
) {

    const identifier = useFieldIdentifier(key, label);

    const [ fieldState, setFieldState ] = useState<FormFieldState>(FormFieldState.CONSTRUCTED);
    const [ files, setFiles ] = useState<any | undefined>([]);
    const propsValues = propsValue;

    const changeCallback = useFieldChangeCallback<T>(
        identifier,
        change
    );

    const updateCurrentItemFromFocusCallback = useCallback(
        () => {

        },
        [

        ]
    );

    const onFocusCallback = useCallback(
        () => {
            if ( !files ) {
                LOG.debug(`${identifier}: Dropdown not open, opening it`);

            } else {
                LOG.debug(`${identifier}: Dropdown was open, updating current item from focus`);
                updateCurrentItemFromFocusCallback();
            }
        },
        [
            identifier,
            updateCurrentItemFromFocusCallback
        ]
    );

    const validateStringValueCallback = (identifier:any, propsValues:any) => {
        if(identifier && propsValues) return true
        return false
    }

    const updateFieldStateCallback = useFieldArrayUpdateCallback<T>(
        identifier,
        fieldState,
        setFieldState,
        propsValue,
        isRequired,
        validateStringValueCallback
    );

    const mountCallback = useCallback(
        () => {

            setFieldState(FormFieldState.MOUNTED);
            updateFieldStateCallback();
        },
        [
            identifier,
            setFieldState,
            updateFieldStateCallback,
        ]
    );

    const unmountCallback = useCallback(
        () => {
            setFieldState(FormFieldState.UNMOUNTED);
        },
        [
            setFieldState,
        ]
    );

    useMountEffect(
        identifier,
        mountCallback,
        unmountCallback
    );

    // Update state when propsValue changes
    useEffect(
        () => {
            LOG.debug(`${identifier}: Props value changed: `, propsValue);
            updateFieldStateCallback();
        },
        [
            identifier,
            propsValue,
            updateFieldStateCallback,
        ]
    );

    // Update field state if props.model.required changes
    useEffect(
        () => {
            LOG.debug(`${identifier}: isRequired values changed`);
            updateFieldStateCallback();
        },
        [
            identifier,
            updateFieldStateCallback
        ]
    );

    useFieldChangeState(changeState, fieldState);

    const onChangeCallback = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            cancelKeyEvent(event);
        },
        []
    );

    /*const onChangeBooleanCallback = useCallback(        // For testing checkbox only - search functionality on / off
        (event: ChangeEvent<HTMLInputElement>) => {
            if(event) {
                setSearchFieldOn(!searchFieldOn);
            }
        },
        [
            searchFieldOn
        ]
    );*/

    return {
        fieldState,
        label,
        onFocusCallback,
        onChangeCallback,
        files,
        setFiles
    };

}

function elementHasFocus (el: HTMLInputElement | HTMLButtonElement): boolean {
    return el.contains(document.activeElement);
}

function cancelKeyEvent (event: KeyboardEvent | ChangeEvent) {
    if ( event ) {
        event.stopPropagation();
        event.preventDefault();
    }
}
