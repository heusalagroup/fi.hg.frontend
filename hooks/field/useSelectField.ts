// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useEffect, useState } from "react";
import { FormFieldState } from "../../types/FormFieldState";
import { useFieldChangeState } from "./useFieldChangeState";
import { LogService } from "../../../core/LogService";
import { FieldChangeCallback } from "../../components/fields/FieldProps";
import { useFieldStringChangeEventCallback } from "./string/useFieldStringChangeEventCallback";
import { useFieldStringStateUpdateCallback } from "./string/useFieldStringStateUpdateCallback";
import { useFieldIdentifier } from "./useFieldIdentifier";
import { useFieldMountEffect } from "./useFieldMountEffect";
import { useFieldStringInternalValueUpdateCallback } from "./string/useFieldStringInternalValueUpdateCallback";
import { useFieldValidateStringValueCallback } from "./string/useFieldValidateStringValueCallback";
import { useFieldValidateStringWithStateValueCallback } from "./string/useFieldValidateStringWithStateValueCallback";
import { SelectFieldItem } from "../../types/items/SelectFieldModel";

const LOG = LogService.createLogger('useSelectField');

type InternalValueType = string;

export function useSelectField (
    label: string,
    key: string,
    change: FieldChangeCallback<InternalValueType | undefined> | undefined,
    changeState: FieldChangeCallback<FormFieldState> | undefined,
    propsValue: string | undefined,
    isRequired: boolean,
    propsMinLength: number | undefined,
    propsMaxLength: number | undefined
) {

    const identifier = useFieldIdentifier(key, label);

    const selectItems       : readonly SelectFieldItem<any>[] = this._getValues<any>();
    const currentItemIndex  : number | undefined = this._getCurrentIndex();
    const selectedItem      : SelectFieldItem<any> | undefined = currentItemIndex !== undefined ? selectItems[currentItemIndex] : undefined;
    const selectedItemLabel : string = selectedItem?.label ?? '';

    const [ fieldState, setFieldState ] = useState<FormFieldState>(FormFieldState.CONSTRUCTED);
    const [ value, setValue ] = useState<InternalValueType>(propsValue ?? '');

    const updateValueStateCallback = useFieldStringInternalValueUpdateCallback(
        identifier,
        setValue,
        propsValue
    );

    const validateStringValueCallback = useFieldValidateStringValueCallback(identifier);
    const validateWithStateValueCallback = useFieldValidateStringWithStateValueCallback(identifier, validateStringValueCallback);

    const updateFieldStateCallback = useFieldStringStateUpdateCallback(
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

    const onChangeCallback = useFieldStringChangeEventCallback(
        identifier,
        setValue,
        change
    );

    useFieldMountEffect(
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
