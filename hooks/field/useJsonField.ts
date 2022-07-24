// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useFieldIdentifier } from "./useFieldIdentifier";
import { useCallback, useEffect, useState } from "react";
import { FormFieldState } from "../../types/FormFieldState";
import { useFieldStringChangeEventCallback } from "./string/useFieldStringChangeEventCallback";
import { useFieldMountEffectWithInternalState } from "./useFieldMountEffectWithInternalState";
import { useFieldChangeState } from "./useFieldChangeState";
import { LogService } from "../../../core/LogService";
import { parseJson, ReadonlyJsonAny } from "../../../core/Json";
import { useFieldValidateStringValueCallback } from "./string/useFieldValidateStringValueCallback";
import { useFieldJsonStateUpdateCallback } from "./json/useFieldJsonStateUpdateCallback";
import { useFieldValidateJsonWithStateValueCallback } from "./json/useFieldValidateJsonWithStateValueCallback";
import { useFieldValidateJsonValueCallback } from "./json/useFieldValidateJsonValueCallback";
import { useFieldJsonInternalValueUpdateCallback } from "./json/useFieldJsonInternalValueUpdateCallback";
import { FieldChangeCallback } from "./useFieldChangeCallback";

const LOG = LogService.createLogger('useJsonField');

type InternalValueType = string;

export function useJsonField (
    label: string,
    key: string,
    change: FieldChangeCallback<ReadonlyJsonAny | undefined> | undefined,
    changeState: FieldChangeCallback<FormFieldState> | undefined,
    propsValue: ReadonlyJsonAny | undefined,
    isRequired: boolean,
    propsMinLength: number | undefined,
    propsMaxLength: number | undefined
) {

    const identifier = useFieldIdentifier(key, label);

    const [ fieldState, setFieldState ] = useState<FormFieldState>(FormFieldState.CONSTRUCTED);
    const [ value, setValue ] = useState<InternalValueType>(getInternalValueString(propsValue));

    const updateValueStateCallback = useFieldJsonInternalValueUpdateCallback(
        identifier,
        setValue,
        propsValue,
        getInternalValueString
    );

    const validateStringValueCallback = useFieldValidateStringValueCallback(identifier);

    const validateJsonStringValueCallback = useFieldValidateJsonValueCallback(
        validateStringValueCallback,
        getInternalValueString
    );

    const validateWithStateValueCallback = useFieldValidateJsonWithStateValueCallback(identifier, validateJsonStringValueCallback);

    const updateFieldStateCallback = useFieldJsonStateUpdateCallback(
        identifier,
        fieldState,
        setFieldState,
        value,
        propsValue,
        isRequired,
        propsMinLength,
        propsMaxLength,
        validateWithStateValueCallback
    );

    const parseAndChangeCallback = useCallback(
        (newValue: string | undefined) => {
            if (change) {
                const parsedValue = parseJson(newValue) as ReadonlyJsonAny | undefined;
                change(parsedValue);
            }
        },
        [
            change
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
            propsMinLength,
            propsMaxLength,
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

export function getInternalValueString (value: ReadonlyJsonAny | undefined) : string {
    try {
        if (value === undefined) {
            return '';
        }
        return value ? JSON.stringify(value, null, 2) : ''
    } catch(err) {
        LOG.error(`Could not stringify value as string: `, err);
        return '';
    }
}
