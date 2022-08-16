import moment from "moment-timezone"
import { useCallback, useEffect, useRef, useState } from "react"
import { LogService } from "../../../../core/LogService";
import { CalendarProps } from "../../fields/datePicker/DatePickerField";

interface CalendarModalProps extends CalendarProps {
    readonly onChangeCallback?: (value: string) => void;
    readonly calendarStyling?: (day: moment.Moment) => "" | "before" | "today";
    readonly focus?: (value: boolean) => void;
}

interface WeekMoment {
    value: moment.Moment;
    index: number;
    array?: moment.Moment[];
}

const LOG = LogService.createLogger('CalendarModal');


export function Calendar(props: CalendarModalProps) {
    const { onChangeCallback, buildCalendar, calendarStyling, focus } = props;
    const [value, setValue] = useState(moment())
    const [selectedValue, setSelectedValue] = useState(moment())
    const [calendar, setCalendar] = useState<moment.Moment[]>([])

    const inputReference = useRef<HTMLInputElement>(null);


    useEffect(() => {
        buildMonth();
    }, [value, focus])

    function currMonthName() {
        return value.format("MM")
    }

    function currYear() {
        return value.format("YYYY")
    }

    function prevMonth() {
        return value.clone().subtract(1, "month")
    }

    function nextMonth() {
        return value.clone().add(1, "month")
    }

    const buildMonth = useCallback(() => {
        setCalendar(buildCalendar(value))
    },
        [
            prevMonth,
            nextMonth
        ]
    )

    const handleDateData = (curr: moment.Moment): void => {
        const newVal = curr.toISOString()
        LOG.debug('Input value from newVal', newVal, typeof (newVal))
        if (onChangeCallback) {
            onChangeCallback(newVal)
        }
    }

    const handeClick = (day: moment.Moment): void => {
        LOG.debug('value value onclick', day)
        const curr = day;
        setSelectedValue(curr)
        setValue(curr)
        if (curr !== value) {
            setValue(curr)
        }
        handleDateData(curr)
    }

    const handleBlur = () => {
        if (focus) focus(false);
    }
    const handleFocus = () => {
        if (focus) focus(true);
    }

    return (                                            // Calendar component
        <div className='datepicker-form-container' onBlur={handleBlur} tabIndex={1} ref={inputReference} onFocus={handleFocus}>
            <div className='datepicker-header'>
                <div className='previous' onClick={() => setValue(prevMonth())}>{String.fromCharCode(171)}</div>
                <div className='current'>{currMonthName()} {currYear()}</div>
                <div className='next' onClick={() => setValue(nextMonth())}>{String.fromCharCode(187)}</div>
            </div>
            {calendar?.map((week: any) =>
                <div className='week-container'>
                    {
                        week.map((day: moment.Moment): JSX.Element => (
                            <div className='datepicker-day-container' onClick={() => handeClick(day)}>
                                {calendarStyling && (
                                    <div className={selectedValue.isSame(day, 'date') ? 'selected' : calendarStyling(day)}>
                                        {day.format("D").toString()}
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            )}
        </div>
    )
}