import moment from "moment-timezone"
import { useCallback, useEffect, useState } from "react"
import { LogService } from "../../../../core/LogService";



const LOG = LogService.createLogger('CalendarModal');


export function Calendar(props:any) {
    const {buildCalendar, onChangeCallback, calendarStyling} = props;
    const [value, setValue] = useState(moment())
    const [selected, setSelected] = useState(moment())
    const [calendar, setCalendar] = useState<any[]>([])


    useEffect(() => {
        buildMonth()
    }, [value])

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

    const handleDateData = useCallback(() => {
        const newVal = selected.toISOString()
        LOG.debug('Input value from newVal', newVal, typeof(newVal))

        onChangeCallback(newVal)
    },
        [
            value
        ]
    )

    const handeClick = useCallback((day: any) => {
        LOG.debug('value value', day)
        setValue(day)
        if (value !== selected) setSelected(value)
        handleDateData()
    },
        [
            buildMonth,
            value
        ]
    )

    return (                                            // Calendar component
        <div className='datepicker-form-container'>
            <div className='datepicker-header'>
                <div className='previous' onClick={() => setValue(prevMonth())}>{String.fromCharCode(171)}</div>
                <div className='current'>{currMonthName()} {currYear()}</div>
                <div className='next' onClick={() => setValue(nextMonth())}>{String.fromCharCode(187)}</div>

            </div>
            {calendar?.map((week: any) =>
                <div className='week-container'>
                    {
                        week.map((day: any) => (
                            <div className='datepicker-day-container' onClick={() => handeClick(day)}>
                                <div className={selected.isSame(day, 'date') ? 'selected' : calendarStyling(day)}>
                                    {day.format("D").toString()}
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    )
}