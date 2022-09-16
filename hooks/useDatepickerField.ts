// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useEffect, useState } from "react";
import { FormFieldState } from "../types/FormFieldState";
import { useFieldChangeState } from "./field/useFieldChangeState";
import { LogService } from "../../core/LogService";
import { useFieldIdentifier } from "./field/useFieldIdentifier";
import { useFieldMountEffectWithInternalState } from "./field/useFieldMountEffectWithInternalState";
import { FieldChangeCallback } from "./field/useFieldChangeCallback";
import { useFieldStringStateUpdateCallback } from "./field/string/useFieldStringStateUpdateCallback";
import { useFieldValidateStringWithStateValueCallback } from "./field/string/useFieldValidateStringWithStateValueCallback";
import { useFieldValidateStringValueCallback } from "./field/string/useFieldValidateStringValueCallback";
import { useFieldStringInternalValueUpdateCallback } from "./field/string/useFieldStringInternalValueUpdateCallback";
import { moment, momentType } from "../../core/modules/moment";
import { CalendarStylingCallback } from "../components/modal/Calendar/types/CalendarStylingCallback";
import { CalendarStyling } from "../components/modal/Calendar/types/CalendarStyling";
import { useFieldDateChangeEventCallback } from "./field/string/useFieldDateChangeEventCallback";

const LOG = LogService.createLogger('useDatepickerField');

type InternalValueType = string;

export function useDatePicker (
    label: string,
    key: string,
    change: FieldChangeCallback<InternalValueType | undefined> | undefined,
    changeState: FieldChangeCallback<FormFieldState> | undefined,
    propsValue: string | undefined,
    isRequired: boolean,
    propsMinLength: number | undefined,
    propsMaxLength: number | undefined,
    dateFormat?: string
) {
    const identifier = useFieldIdentifier(key, label);
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
        change,
        dateFormat
    );

    useFieldMountEffectWithInternalState(
        identifier,
        setFieldState,
        updateValueStateCallback,
        updateFieldStateCallback
    );

    const buildCalendar = useCallback(
        (value: momentType): any[] => {
            const startDay = moment(value).clone().startOf("month").startOf("week");
            const endDay = moment(value).clone().endOf("month").endOf("week");

            const day = startDay.clone();
            const calendarArray: any = [];
            while ( day.isBefore(endDay, "day") ) {
                calendarArray.push(
                    Array(7).fill(0).map(() => day.add(1, "day").clone())
                );
            }
            return calendarArray;
        },
        []
    );

    const calendarStyling: CalendarStylingCallback = useCallback(
        (day: momentType): CalendarStyling => {

            function beforeToday (day: momentType) {
                return day.isBefore(new Date(), CalendarStyling.DAY);
            }

            function isToday (day: momentType) {
                return day.isSame(new Date(), CalendarStyling.DAY);
            }

            function dayStyles (day: momentType) {
                if ( beforeToday(day) ) return CalendarStyling.BEFORE;
                if ( isToday(day) ) return CalendarStyling.TODAY;
                return CalendarStyling.NONE;
            }

            return dayStyles(day);
        },
        []
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
            onChangeCallback
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
        onChangeCallback,
        buildCalendar,
        calendarStyling
    };
}

