// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useEffect, useState } from "react";
import { FormFieldState } from "../../types/FormFieldState";
import { useFieldChangeState } from "./useFieldChangeState";
import { LogService } from "../../../core/LogService";
import { useFieldDateChangeEventCallback } from "./string/useFieldStringChangeEventCallback";
import { useFieldIdentifier } from "./useFieldIdentifier";
import { useFieldMountEffectWithInternalState } from "./useFieldMountEffectWithInternalState";
import { FieldChangeCallback } from "./useFieldChangeCallback";
import moment from "moment-timezone";
import { useFieldStringStateUpdateCallback } from "./string/useFieldStringStateUpdateCallback";
import { useFieldValidateStringWithStateValueCallback } from "./string/useFieldValidateStringWithStateValueCallback";
import { useFieldValidateStringValueCallback } from "./string/useFieldValidateStringValueCallback";
import { useFieldStringInternalValueUpdateCallback } from "./string/useFieldStringInternalValueUpdateCallback";

const LOG = LogService.createLogger('useDatepickerField');

type InternalValueType = string;

export function useDateField(
    label: string,
    key: string,
    change: FieldChangeCallback<InternalValueType | undefined> | undefined,
    changeState: FieldChangeCallback<FormFieldState> | undefined,
    propsValue: string | undefined,
    isRequired: boolean,
    propsMinLength: number | undefined,
    propsMaxLength: number | undefined
) {

    const identifier = useFieldIdentifier(key, label);  //key: label string pair

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

    const onChangeCallback = useFieldDateChangeEventCallback(
        identifier,
        setValue,
        change
    );

    useFieldMountEffectWithInternalState(
        identifier,
        setFieldState,
        updateValueStateCallback,
        updateFieldStateCallback
    );

    const buildCalendar = (value: any): any => {
        const startDay = value.clone().startOf("month").startOf("week");
        const endDay = value.clone().endOf("month").endOf("week");

        const day = startDay.clone().subtract(1, "day");
        const calendarArray: any = []
        while (day.isBefore(endDay, "day")) {
            calendarArray.push(
                Array(7).fill(0).map(() => day.add(1, "day").clone())
            );
        }
        return calendarArray
    }


    const calendarStyling = useCallback((day: moment.Moment) => {

        function beforeToday(day: moment.Moment) {
            return day.isBefore(new Date(), "day");
        }

        function isToday(day: moment.Moment) {
            return day.isSame(new Date(), "day");
        }

        function dayStyles(day: moment.Moment) {
            if (beforeToday(day)) return "before"
            if (isToday(day)) return "today"
            return ""
        }
        return dayStyles(day)
    },
        [
            value,
            onChangeCallback,
            buildCalendar,
            updateFieldStateCallback
        ]
    )

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
            onChangeCallback,
        ]
    );

    // Update state when propsValue changes
    useEffect(
        () => {
            LOG.debug(`${identifier}: Props value changed: `, propsValue);
            updateValueStateCallback();
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
            propsMinLength,
            propsMaxLength,
            updateFieldStateCallback,
        ]
    );

    

    useFieldChangeState(changeState, fieldState);

    return {
        fieldState,
        label,
        value,
        onChangeCallback,
        buildCalendar,
        calendarStyling
    };
};

