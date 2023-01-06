
import { useEffect, useState } from "react";
import { TIMER_CLASS_NAME } from "../../../constants/hgClassName";
import { padStart } from "../../../../core/functions/padStart";
import "./Timer.scss";

/**
 * @FIXME Change this use global TimerService instead of it's own timer
 * @param value
 * @constructor
 */
export function Timer ({value}:{value:number}) {

    let [now, setNow] = useState<number>(Date.now());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(Date.now());
        }, 1000);
        return () => {
            clearInterval(timer);
        }
    });

    if ( now >= value ) {
        return <>-</>;
    }

    const hours   = Math.floor( ( value - now) / 1000/60/60 );
    const minutes = Math.floor( ( value - now) / 1000/60 ) - hours*60;
    const seconds = Math.floor( ( value - now) / 1000 ) - (hours*60*60 + minutes * 60);

    return (
        <span className={TIMER_CLASS_NAME}>{hours}:{padStart(`${minutes}`, 2, '0')}:{padStart(`${seconds}`, 2, '0')}</span>
    );

}
