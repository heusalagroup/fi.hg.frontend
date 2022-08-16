// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { DATE_CARD_CLASS_NAME } from "../../../constants/hgClassName";
import { Card } from "../Card";
import { useTimeString } from "../../../hooks/useTimeString";
import "./DateCard.scss";

export interface DateCardProps {
    readonly className ?: string;
    readonly label ?: string;
    readonly value ?: string;
    readonly format ?: string;
}

export function DateCard (props: DateCardProps) {
    const className = props?.className;
    const label = props?.label;
    const value = props?.value;
    const format = props?.format ?? 'YYYY-MM-DD';
    const valueString = useTimeString(value, format);
    return (
        <Card className={
            DATE_CARD_CLASS_NAME
            + (className? ` ${className}` : '')
        }
        label={label}
        >{valueString}</Card>
    );
}
