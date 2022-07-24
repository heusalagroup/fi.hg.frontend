// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useEffect, useState } from "react";
import { FormFieldState } from "../../types/FormFieldState";
import { useFieldChangeState } from "./useFieldChangeState";
import { LogService } from "../../../core/LogService";
import { useFieldStringChangeEventCallback } from "./string/useFieldStringChangeEventCallback";
import { useFieldIdentifier } from "./useFieldIdentifier";
import { useFieldMountEffectWithInternalState } from "./useFieldMountEffectWithInternalState";
import { useFieldNumberStateUpdateCallback } from "./number/useFieldNumberStateUpdateCallback";
import { useFieldNumberInternalValueUpdateCallback } from "./number/useFieldNumberInternalValueUpdateCallback";
import { useFieldValidateNumberWithStateValueCallback } from "./number/useFieldValidateNumberWithStateValueCallback";
import { useFieldValidateNumberValueCallback } from "./number/useFieldValidateNumberValueCallback";
import { FieldChangeCallback } from "./useFieldChangeCallback";

const LOG = LogService.createLogger('useNumberField');

type InternalValueType = string;

export interface ToNumberCallback {
    (value: string | undefined) : number | undefined;
}

export interface StringifyNumberCallback {
    (value: number | undefined) : string;
}

export function useNumberField (
    label: string,
    key: string,
    change: FieldChangeCallback<number | undefined> | undefined,
    changeState: FieldChangeCallback<FormFieldState> | undefined,
    propsValue: number | undefined,
    isRequired: boolean,
    propsMinValue: number | undefined,
    propsMaxValue: number | undefined,
    toNumber: ToNumberCallback,
    stringifyNumber: StringifyNumberCallback
) {

    const identifier = useFieldIdentifier(key, label);

    const [ fieldState, setFieldState ] = useState<FormFieldState>(FormFieldState.CONSTRUCTED);
    const [ value, setValue ] = useState<InternalValueType>(stringifyNumber(propsValue));

    const updateValueStateCallback = useFieldNumberInternalValueUpdateCallback(
        identifier,
        setValue,
        propsValue,
        stringifyNumber
    );

    const validateNumberValueCallback = useFieldValidateNumberValueCallback(identifier);

    const validateWithStateValueCallback = useFieldValidateNumberWithStateValueCallback(
        identifier,
        validateNumberValueCallback,
        toNumber
    );

    const updateFieldStateCallback = useFieldNumberStateUpdateCallback(
        identifier,
        fieldState,
        setFieldState,
        value,
        propsValue,
        isRequired,
        propsMinValue,
        propsMaxValue,
        validateWithStateValueCallback
    );

    const parseAndChangeCallback = useCallback(
        (newValue: string | undefined) => {
            if (change) {
                change(toNumber(newValue));
            }
        },
        [
            change,
            toNumber
        ]
    );

    const onChangeCallback = useFieldStringChangeEventCallback(
        identifier,
        setValue,
        parseAndChangeCallback
    );

    useFieldMountEffectWithInternalState(
        identifier,
        setFieldState,
        updateValueStateCallback,
        updateFieldStateCallback
    );

    // Update field state when internal value changes
    useEffect(
        () => {
            LOG.debug(`${identifier}: Internal value changed: `, value);
            updateFieldStateCallback();
        },
        [
            identifier,
            value,
            updateFieldStateCallback
        ]
    );

    // Update state when propsValue changes
    useEffect(
        () => {
            LOG.debug(`${identifier}: Props value changed: `, propsValue);
            updateValueStateCallback();
            updateFieldStateCallback();
        },
        [
            identifier,
            propsValue,
            updateValueStateCallback,
            updateFieldStateCallback
        ]
    );

    // Update field state if props.model.required, minLength or maxLength changes
    useEffect(
        () => {
            LOG.debug(`${identifier}: isRequired, minLength or maxLength values changed`);
            updateFieldStateCallback();
        },
        [
            identifier,
            isRequired,
            propsMinValue,
            propsMaxValue,
            updateFieldStateCallback
        ]
    );

    useFieldChangeState(changeState, fieldState);

    return {
        fieldState,
        label,
        value,
        onChangeCallback
    };

}

