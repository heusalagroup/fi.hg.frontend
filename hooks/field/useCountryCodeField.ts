// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useEffect, useState } from "react";
import { FormFieldState } from "../../types/FormFieldState";
import { useFieldChangeState } from "./useFieldChangeState";
import { LogService } from "../../../core/LogService";
import { useFieldStringChangeEventCallback } from "./string/useFieldStringChangeEventCallback";
import { useFieldIdentifier } from "./useFieldIdentifier";
import { useFieldMountEffectWithInternalState } from "./useFieldMountEffectWithInternalState";
import { useFieldStringInternalValueUpdateCallback } from "./string/useFieldStringInternalValueUpdateCallback";
import { CountryCode, parseCountryCode } from "../../../core/types/CountryCode";
import { useFieldValidateCountryCodeValueCallback } from "./countryCode/useFieldValidateCountryCodeValueCallback";
import { useFieldValidateCountryCodeWithStateValueCallback } from "./countryCode/useFieldValidateCountryCodeWithStateValueCallback";
import { useFieldCountryCodeStateUpdateCallback } from "./countryCode/useFieldCountryCodeStateUpdateCallback";
import { FieldChangeCallback } from "./useFieldChangeCallback";

const LOG = LogService.createLogger('useCountryCodeField');

type InternalValueType = string;

export function useCountryCodeField (
    label: string,
    key: string,
    change: FieldChangeCallback<CountryCode | undefined> | undefined,
    changeState: FieldChangeCallback<FormFieldState> | undefined,
    propsValue: CountryCode | undefined,
    isRequired: boolean,
    propsMinLength: number | undefined,
    propsMaxLength: number | undefined,
    defaultCountryCode: CountryCode
) {

    const identifier = useFieldIdentifier(key, label);

    const [ fieldState, setFieldState ] = useState<FormFieldState>(FormFieldState.CONSTRUCTED);
    const [ value, setValue ] = useState<InternalValueType>(propsValue ?? defaultCountryCode);

    const updateValueStateCallback = useFieldStringInternalValueUpdateCallback(
        identifier,
        setValue,
        propsValue
    );

    const validateValueCallback = useFieldValidateCountryCodeValueCallback(identifier);
    const validateWithStateValueCallback = useFieldValidateCountryCodeWithStateValueCallback(identifier, validateValueCallback);

    const updateFieldStateCallback = useFieldCountryCodeStateUpdateCallback(
        identifier,
        fieldState,
        setFieldState,
        value,
        propsValue,
        isRequired,
        validateWithStateValueCallback
    );

    const parseAndChangeCallback = useCallback(
        (newValue: string | undefined) => {
            if (change) {
                const parsedValue = parseCountryCode(newValue);
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
