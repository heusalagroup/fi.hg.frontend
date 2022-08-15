import moment from "moment-timezone"
import { useCallback, useEffect, useState } from "react"
import { LogService } from "../../../../core/LogService";
import { CalendarProps } from "../../fields/datePicker/DatePickerField";

interface CalendarModalProps extends CalendarProps {
    readonly onChangeCallback?: (value:string) => void;
    readonly calendarStyling?: (value: moment.Moment) => "" | "before" | "today";
    readonly focus?: boolean;
}

const LOG = LogService.createLogger('CalendarModal');


export function Calendar(props: CalendarModalProps) {
    const {onChangeCallback ,buildCalendar, calendarStyling, focus} = props;
    const [value, setValue] = useState(moment())
    const [calendar, setCalendar] = useState<any[]>([])


    useEffect(() => {
        buildMonth()
        console.log('building month')
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

    const handleDateData = (curr:any):void => {
        const newVal = curr.toISOString()
        LOG.debug('Input value from newVal', newVal, typeof (newVal))
        if(onChangeCallback) {
            onChangeCallback(newVal)
        }
    }

    const handeClick = (day: moment.Moment):void => {
        LOG.debug('value value onclick', day)
        const curr = day;
        setValue(curr)
        if (curr !== value){
            setValue(curr)
        } 
        handleDateData(curr)
    }
    

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
                                {calendarStyling && (
                                <div className={value.isSame(day, 'date') ? 'selected' : calendarStyling(day)}>
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