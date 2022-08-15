// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { ReactNode, useState } from 'react';
import { DatePickerFieldModel } from "../../../types/items/DatepickerModel";
import { FormFieldState, stringifyFormFieldState } from "../../../types/FormFieldState";
import { ThemeService } from "../../../services/ThemeService";
import { stringifyStyleScheme, StyleScheme } from "../../../types/StyleScheme";
import {
    FIELD_CLASS_NAME,
    DATE_PICKER_FIELD_CLASS_NAME
} from "../../../constants/hgClassName";
import { FieldChangeCallback } from "../../../hooks/field/useFieldChangeCallback";
import './DatePickerField.scss';
import moment from 'moment-timezone';
import { useDateField } from '../../../hooks/field/useDatepickerField';
import { TranslationFunction } from "../../../../../../fi/hg/core/types/TranslationFunction";
import { LogService } from '../../../../core/LogService';
import { Calendar } from '../../modal/Calendar/CalendarModal';

const COMPONENT_CLASS_NAME = DATE_PICKER_FIELD_CLASS_NAME;
const COMPONENT_INPUT_TYPE = "text";

const LOG = LogService.createLogger('DatepickerField');


export interface DatePickerFieldProps {
    readonly t?: TranslationFunction
    readonly className?: string;
    readonly style?: StyleScheme;
    readonly label?: string;
    readonly placeholder?: string;
    readonly model?: DatePickerFieldModel;
    readonly value?: string;
    readonly change?: FieldChangeCallback<string | undefined>;
    readonly changeState?: FieldChangeCallback<FormFieldState>;
    readonly children?: ReactNode;
}

export interface CalendarProps {
    buildCalendar: (value: moment.Moment) => moment.Moment[]
}

export function DatePickerField(props: DatePickerFieldProps) {
    const t = props?.t;
    const className = props?.className;
    const styleScheme = props?.style ?? ThemeService.getStyleScheme();
    const placeholder = props.placeholder ?? props.model?.placeholder;
    const label = props.label ?? props.model?.label ?? '';

    const [showCalendar, setShowCalendar] = useState(false);

    const {
        fieldState,
        value,
        onChangeCallback,
        buildCalendar,
        calendarStyling
    } = useDateField(
        label,
        props?.model?.key ?? '',
        props?.change,
        props?.changeState,
        props?.value,
        props?.model?.required ?? false,
        props?.model?.minLength,
        props?.model?.maxLength
    );

    const onChange = (e: any) => {
        e.preventDefault();
    }

    return (                                                // Input field
        <div className='datepicker-container'>
            <label
                className={
                    `${COMPONENT_CLASS_NAME} ${FIELD_CLASS_NAME}`
                    + ` ${FIELD_CLASS_NAME}-style-${stringifyStyleScheme(styleScheme)}`
                    + ` ${FIELD_CLASS_NAME}-state-${stringifyFormFieldState(fieldState)}`
                    + ` ${className ? ` ${className}` : ''}`
                }
            >
                {label ? (
                    <span className={
                        COMPONENT_CLASS_NAME + '-label'
                        + ` ${FIELD_CLASS_NAME}-label`
                    }>{label}</span>
                ) : null}
                <input
                    className={
                        COMPONENT_CLASS_NAME + '-input'
                        + ` ${FIELD_CLASS_NAME}-input`
                    }
                    type={COMPONENT_INPUT_TYPE}
                    autoComplete="off"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onClick={() => setShowCalendar(!showCalendar)}
                    readOnly={props?.change === undefined}
                />
                {props.children}
            </label>
            { showCalendar ?
                <Calendar 
                onChangeCallback={onChangeCallback} 
                buildCalendar={buildCalendar} 
                calendarStyling={calendarStyling}
                focus={setShowCalendar}
                 /> : ''}
        </div>
    );

}





