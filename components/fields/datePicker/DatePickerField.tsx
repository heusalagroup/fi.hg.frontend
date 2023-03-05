// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { ReactNode, useCallback, useState, ChangeEvent } from "react";
import { DatePickerFieldModel } from "../../../types/items/DatepickerFieldModel";
import { FormFieldState, stringifyFormFieldState } from "../../../types/FormFieldState";
import { ThemeService } from "../../../services/ThemeService";
import { stringifyStyleScheme, StyleScheme } from "../../../types/StyleScheme";
import {
    FIELD_CLASS_NAME,
    DATE_PICKER_FIELD_CLASS_NAME
} from "../../../constants/hgClassName";
import { FieldChangeCallback } from "../../../hooks/field/useFieldChangeCallback";
import { useDatePicker } from "../../../hooks/useDatepickerField";
import { TranslationFunction } from "../../../../core/types/TranslationFunction";
import { Calendar } from '../../modal/Calendar/CalendarModal';
import { momentType } from "../../../../core/modules/moment";
import './DatePickerField.scss';

const COMPONENT_CLASS_NAME = DATE_PICKER_FIELD_CLASS_NAME;
const COMPONENT_INPUT_TYPE = "text";

export interface DatePickerFieldProps {
    readonly t?: TranslationFunction
    readonly className?: string;
    readonly style?: StyleScheme;
    readonly label?: string;
    readonly placeholder?: string;
    readonly model?: DatePickerFieldModel;
    readonly value?: string;
    readonly enabled?: boolean | false;
    readonly change?: FieldChangeCallback<string | undefined>;
    readonly changeState?: FieldChangeCallback<FormFieldState>;
    readonly children?: ReactNode;
}

export interface CalendarProps {
    buildCalendar: (value: momentType) => momentType[];
}

export function DatePickerField(props: DatePickerFieldProps) {
    const className = props?.className;
    const styleScheme = props?.style ?? ThemeService.getStyleScheme();
    const placeholder = props.placeholder ?? props.model?.placeholder;
    const label = props.label ?? props.model?.label ?? '';
    const isEnabled = props.enabled ?? true;
    const [showCalendar, setShowCalendar] = useState(false);
    const {
        fieldState,
        value,
        onChangeCallback,
        buildCalendar,
        calendarStyling
    } = useDatePicker(
        label,
        props?.model?.key ?? '',
        props?.change,
        props?.changeState,
        props?.value,
        props?.model?.required ?? false,
        props?.model?.minLength,
        props?.model?.maxLength
    );
    const onChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
        },
        []
    );
    return (
        <div className={`${COMPONENT_CLASS_NAME}${className ? ` ${className}` : ''}`}>
            <label className={
                COMPONENT_CLASS_NAME+'-label'
                + ` ${FIELD_CLASS_NAME}`
                + ` ${FIELD_CLASS_NAME}-style-${stringifyStyleScheme(styleScheme)}`
                + ` ${FIELD_CLASS_NAME}-state-${stringifyFormFieldState(fieldState)}`
                + (isEnabled ? '' : ' '+FIELD_CLASS_NAME+'-disabled')
            }>
                {label ? (
                    <span className={
                        COMPONENT_CLASS_NAME + '-label-text'
                        + ` ${FIELD_CLASS_NAME}-label-text`
                    }>{label}</span>
                ) : null}
                <input
                    className={
                        COMPONENT_CLASS_NAME + '-input'
                        + ` ${FIELD_CLASS_NAME}-input`
                    }
                    type={COMPONENT_INPUT_TYPE}
                    disabled={!isEnabled}
                    autoComplete="off"
                    placeholder={placeholder}
                    value={value?.slice(0, 10)}
                    onChange={onChange}
                    onClick={() => setShowCalendar(!showCalendar)}
                    readOnly={props?.change === undefined}
                />
                {props.children}
            </label>
            { showCalendar && isEnabled ?
                <Calendar
                onChangeCallback={onChangeCallback}
                buildCalendar={buildCalendar}
                calendarStyling={calendarStyling}
                focus={setShowCalendar}
                 /> : ''}
        </div>
    );
}
