// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { CALENDAR_MODAL_CLASS_NAME } from "../../../constants/hgClassName";
import { useCallback, useEffect, useRef, useState } from "react";
import { LogService } from "../../../../core/LogService";
import { CalendarProps } from "../../fields/datePicker/DatePickerField";
import { moment, momentType } from "../../../../core/modules/moment";
import { CalendarStylingCallback } from "./types/CalendarStylingCallback";
import './CalendarModal.scss';

const LOG = LogService.createLogger('CalendarModal');

export interface CalendarChangeCallback {
    (value: string) : void;
}

export interface CalendarFocusCallback {
    (value: boolean) : void;
}

export interface CalendarModalProps extends CalendarProps {
    readonly className ?: string;
    readonly onChangeCallback ?: CalendarChangeCallback;
    readonly calendarStyling ?: CalendarStylingCallback;
    readonly focus ?: CalendarFocusCallback;
}

export function Calendar (props: CalendarModalProps) {
    const {
        className,
        onChangeCallback,
        buildCalendar,
        calendarStyling,
        focus
    } = props;
    const [ value, setValue ] = useState(moment());
    const [ selectedValue, setSelectedValue ] = useState(moment());
    const [ calendar, setCalendar ] = useState<momentType[]>([]);
    const inputReference = useRef<HTMLInputElement>(null);

    const buildMonth = useCallback(
        () => {
            setCalendar(buildCalendar(value));
        },
        [
            setCalendar,
            buildCalendar,
            value
        ]
    );

    const currMonthName = useCallback(
        () => value.format("MM"),
        [
            value
        ]
    );

    const currYear = useCallback(
        () => value.format("YYYY"),
        [
            value
        ]
    );

    const prevMonth = useCallback(
        () => value.clone().subtract(1, "month"),
        [
            value
        ]
    );

    const nextMonth = useCallback(
        () => value.clone().add(1, "month"),
        [
            value
        ]
    );

    const handleDateData = useCallback(
        (curr: momentType): void => {
            const newVal = curr.toISOString(true);
            LOG.debug('Input value from newVal', newVal, typeof (newVal));
            if ( onChangeCallback ) {
                onChangeCallback(newVal);
            }
        },
        [
            onChangeCallback
        ]
    );

    const handleClick = useCallback(
        (day: momentType): void => {
            LOG.debug('value value onclick', day);
            setSelectedValue(day);
            setValue(day);
            if ( day !== value ) {
                setValue(day);
            }
            handleDateData(day);
        },
        [
            value,
            setSelectedValue,
            setValue,
            handleDateData
        ]
    );

    const handleBlur = useCallback(
        () => {
            if ( focus ) focus(false);
        },
        [
            focus
        ]
    );

    const handleFocus = useCallback(
        () => {
            if ( focus ) focus(true);
        },
        [
            focus
        ]
    );

    // Build month when value or focus changes
    useEffect(
        () => {
            buildMonth();
        },
        [
            buildMonth,
            value,
            focus
        ]
    );

    return (
        <div
            className={
                CALENDAR_MODAL_CLASS_NAME
                + `${className ? ` ${className}` : ''}`
            }
            onBlur={handleBlur}
            tabIndex={1}
            ref={inputReference}
            onFocus={handleFocus}
        >
            <div className={CALENDAR_MODAL_CLASS_NAME + "-datepicker-header"}>
                <div
                    className={CALENDAR_MODAL_CLASS_NAME + "-previous"}
                    onClick={() => setValue(prevMonth())}
                >{String.fromCharCode(171)}</div>
                <div className={CALENDAR_MODAL_CLASS_NAME + "-current"}>{currMonthName()} {currYear()}</div>
                <div
                    className={CALENDAR_MODAL_CLASS_NAME + "-next"}
                    onClick={() => setValue(nextMonth())}
                >{String.fromCharCode(187)}</div>
            </div>
            {calendar?.map(

                (week: any, i) =>
                    <div key={i} className={CALENDAR_MODAL_CLASS_NAME + "-week-container"}>
                        {week.map((day: momentType, index:number): JSX.Element => (
                            <div
                                key={index}
                                className={CALENDAR_MODAL_CLASS_NAME + "-day-container"}
                                onClick={() => handleClick(day)}
                            > {calendarStyling && (
                                <div className={selectedValue.isSame(day, 'date') ? CALENDAR_MODAL_CLASS_NAME + '-selected' : CALENDAR_MODAL_CLASS_NAME+'-'+calendarStyling(day)}>
                                    {day.format("D").toString()}
                                </div>
                            )}</div>
                        ))}
                    </div>
                    )}
        </div>
    );
}
