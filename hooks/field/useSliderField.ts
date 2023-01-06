// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import {
    ChangeEvent,
    useCallback,
    useEffect,
    useState
} from "react";
import { FormFieldState } from "../../types/FormFieldState";
import { useFieldChangeState } from "./useFieldChangeState";
import { LogService } from "../../../core/LogService";
import { useFieldIdentifier } from "./useFieldIdentifier";
import { SelectFieldItem } from "../../types/items/SelectFieldModel";
import { find } from "../../../core/functions/find";
import { useFieldValidateArrayValueCallback } from "./array/useFieldValidateArrayValueCallback";
import { FieldChangeCallback, useFieldChangeCallback } from "./useFieldChangeCallback";
import { useMountEffect } from "../useMountEffect";
import { useIdSequence } from "../useIdSequence";
import { useFieldArrayUpdateCallbackWithStateValue } from "./array/useFieldArrayUpdateCallbackWithStateValue";
import { useFieldValidateArrayValueCallbackWithStateValue } from "./array/useFieldValidateArrayValueCallbackWithStateValue";
import { useSelectItemCallback } from "./array/useSelectItemCallback";

const LOG = LogService.createLogger('useSliderField');

const AUTOMATIC_FIELD_NAME_PREFIX = 'slider-field-';

export function useSliderField<T> (
    label: string,
    key: string,
    change: FieldChangeCallback<T | undefined> | undefined,
    changeState: FieldChangeCallback<FormFieldState> | undefined,
    propsName : string | undefined,
    propsValue: T | undefined,
    propsValues: readonly SelectFieldItem<T>[] | undefined,
    isRequired: boolean
) {

    const id = useIdSequence();
    const identifier = useFieldIdentifier(key, label);
    const name = propsName ?? `${AUTOMATIC_FIELD_NAME_PREFIX}${id}`;

    const [ fieldState, setFieldState ] = useState<FormFieldState>(FormFieldState.CONSTRUCTED);

    LOG.debug(`${identifier}: propsValue: `, propsValue);

    const selectedItem: SelectFieldItem<any> | undefined = propsValues ? find(propsValues, (item: SelectFieldItem<any>): boolean => {
        return item?.value === propsValue;
    }) : undefined;
    LOG.debug(`${identifier}: Selected item: `, selectedItem);

    const changeCallback = useFieldChangeCallback<T>(
        identifier,
        change
    );

    const selectItemCallback = useSelectItemCallback(
        identifier,
        propsValues,
        changeCallback
    );

    // // In theory we could replace useFieldValidateArrayValueCallback<T> with simpler one:
    // const validateValueCallback = useCallback(
    //     (
    //         internalValue: any | undefined,
    //         required: boolean
    //     ): boolean => {
    //         LOG.debug(`${identifier}: _validateValue: internalValue = `, internalValue);
    //         if ( internalValue === undefined ) {
    //             LOG.debug(`${identifier}: _validateValue: required = `, required);
    //             return !required;
    //         }
    //         return true;
    //     },
    //     []
    // );

    const validateValueCallback = useFieldValidateArrayValueCallback<T>(
        identifier,
        propsValues
    );

    const validateWithStateValueCallback = useFieldValidateArrayValueCallbackWithStateValue<T>(
        identifier,
        validateValueCallback
    );

    const updateFieldStateCallback = useFieldArrayUpdateCallbackWithStateValue<T>(
        identifier,
        fieldState,
        setFieldState,
        propsValue,
        propsValues,
        isRequired,
        validateWithStateValueCallback
    );

    const mountCallback = useCallback(
        () => {
            setFieldState(FormFieldState.MOUNTED);
            updateFieldStateCallback();
        },
        [
            setFieldState,
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

    // Update state when propsValue changes
    useEffect(
        () => {
            LOG.debug(`${identifier}: Props value changed: `, propsValue);
            updateFieldStateCallback();
        },
        [
            identifier,
            propsValue,
            propsValues,
            updateFieldStateCallback
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
            isRequired,
            updateFieldStateCallback
        ]
    );

    useFieldChangeState(changeState, fieldState);

    const onChangeCallback = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {

            const valueString = event?.target?.value ?? '';
            LOG.debug(`${identifier}: _onRadioChange: valueString=`, valueString);
            const valueIndex = valueString ? parseInt(valueString, 10) : undefined;
            LOG.debug(`${identifier}: _onRadioChange: valueIndex=`, valueIndex);

            if ( valueIndex !== undefined ) {
                selectItemCallback(valueIndex);
            } else {
                LOG.warn(`${identifier}: _onRadioChange: value invalid: `, valueString);
            }

        },
        [
            selectItemCallback
        ]
    );

    return {
        id,
        fieldState,
        label,
        selectedItem,
        name,
        onChangeCallback
    };

}
