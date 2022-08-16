// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { TIME_COLUMN_CLASS_NAME } from "../../../../constants/hgClassName";
import { useTimeString } from "../../../../hooks/useTimeString";
import { TextColumn } from "../text/TextColumn";
import "./TimeColumn.scss";

export interface TimeColumnProps {
    readonly className ?: string;
    readonly value     ?: string;
    readonly format    ?: string;
}

export function TimeColumn (props: TimeColumnProps) {
    const className = props?.className;
    const value = props?.value;
    const format = props?.format ?? 'YYYY-MM-DD HH:MM';
    const valueString = useTimeString(value, format);
    return (
        <TextColumn
            className={
                TIME_COLUMN_CLASS_NAME
                + (className? ` ${className}` : '')
            }
            value={valueString}
        />
    );
}
