// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useEffect, useState } from "react";
import { FormFieldState } from "../../types/FormFieldState";
import { useFieldChangeState } from "./useFieldChangeState";
import { LogService } from "../../../core/LogService";
import { useFieldStringChangeEventCallback } from "./string/useFieldStringChangeEventCallback";
import { useFieldIdentifier } from "./useFieldIdentifier";
import { useFieldMountEffectWithInternalState } from "./useFieldMountEffectWithInternalState";
import { useFieldNumberStateUpdateCallback } from "./number/useFieldNumberStateUpdateCallback";
import { useFieldDecimalNumberInternalValueUpdateCallback } from "./number/useFieldDecimalNumberInternalValueUpdateCallback";
import { useFieldValidateNumberWithStateValueCallback } from "./number/useFieldValidateNumberWithStateValueCallback";
import { useFieldValidateNumberValueCallback } from "./number/useFieldValidateNumberValueCallback";
import { FieldChangeCallback } from "./useFieldChangeCallback";

const LOG = LogService.createLogger('useDecimalField');

type InternalValueType = string;

export interface ToDecimalNumberCallback {
    (value: string | undefined) : any | undefined;
}

export interface StringifyDecimalNumberCallback {
    (value: number | undefined) : string;
}

export function useDecimalField(
    label: string,
    key: string,
    change: FieldChangeCallback<number | undefined> | undefined,
    changeState: FieldChangeCallback<FormFieldState> | undefined,
    propsValue: number | undefined,
    isRequired: boolean,
    propsMinValue: number | undefined,
    propsMaxValue: number | undefined,
    toNumber: ToDecimalNumberCallback,
    stringifyNumber: StringifyDecimalNumberCallback,
) {

    const identifier = useFieldIdentifier(key, label);  //key: label string pair

    const [fieldState, setFieldState] = useState<FormFieldState>(FormFieldState.CONSTRUCTED);
    const [value, setValue] = useState<InternalValueType>(stringifyNumber(propsValue));
    const [focus, setFocus] = useState<boolean>(false);
    const [validation, setValidation] = useState<boolean>(true);

    // if any of the parameter values change, action will be logged and number propvalue converted to string
    const updateValueStateCallback = useFieldDecimalNumberInternalValueUpdateCallback(
        identifier,
        setValue,
        propsValue,
        stringifyNumber
    );

    const validateNumberValueCallback = useFieldValidateNumberValueCallback(identifier); // returns curried callback function

    const validateWithStateValueCallback = useFieldValidateNumberWithStateValueCallback( // Validates string and returns false or number
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

    const parseAndChangeCallback = useCallback(     // converts string to number and changes state with it
        (newValue: string | undefined) => {         // Had to do 'double' change operation in-order to get onchange to work in-sync
            if (change) {
                change(toNumber(newValue))
            }
        },
        [
            change,
            toNumber,
            value
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
            updateFieldStateCallback,
        ]
    );

    // Update state when propsValue changes
    useEffect(
        () => {
            LOG.debug(`${identifier}: Props value changed: `, propsValue);
            updateValueStateCallback();
            updateFieldStateCallback();
            simpleDecimalValidationCallback();
        },
        [
            identifier,
            propsValue,
            updateValueStateCallback,
            updateFieldStateCallback,
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
            updateFieldStateCallback,
            decimalFunc
        ]
    );

    const handleBlur = () => {
        setFocus(false);
    }
    const handleFocus = () => {
        setFocus(true);
    }

    function decimalFunc(x:string):void {       //scientific notation removal
        LOG.debug('StringConversionToDecimal', x, 'and value', value)
        if(x.toLowerCase().includes('e')) {
            const withoutE = x.replace('e', '')
            setValue(withoutE)
        }
        return;
      }

    const simpleDecimalValidationCallback = useCallback(
        () => {
            const regexVal = /^[\.0-9]*$/;
            const commaReplace = value.replace(',', '.')
            const validated = !regexVal.test(commaReplace);
            if (validated) {
                setValidation(true)
                decimalFunc(commaReplace)
            } else {
                setValidation(false)
            }
        },
        [
            value,
            focus
        ]
    )

    useFieldChangeState(changeState, fieldState);

    return {
        fieldState,
        label,
        value,
        onChangeCallback,
        validation,
        setFocus,
        handleBlur,
        handleFocus
    };

}
