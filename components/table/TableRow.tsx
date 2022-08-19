// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { TABLE_ROW_CLASS_NAME } from "../../constants/hgClassName";
import { ReactNode, useCallback, MouseEvent } from "react";
import { VoidCallback } from "../../../core/interfaces/callbacks";
import "./TableRow.scss";

export interface TableRowProps {
    readonly className ?: string;
    readonly children ?: ReactNode;
    readonly first ?: boolean;
    readonly last ?: boolean;
    readonly click ?: VoidCallback;
}

export function TableRow (props: TableRowProps) {
    const className = props?.className;
    const children = props?.children;
    const first = props?.first;
    const last = props?.last;
    const click = props?.click;
    const onClickCallback = useCallback(
        (event: MouseEvent<HTMLTableRowElement>) => {
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
            if (click) {
                click();
                // FIXME: Add error handling and logging
            }
        },
        [
            click
        ]
    );
    const trProps : {
        onClick ?: any
    } = {};
    if (click) {
        trProps.onClick = onClickCallback;
    }
    return (
        <tr className={
            TABLE_ROW_CLASS_NAME
            + (className? ` ${className}` : '')
            + (first ? ' ' + TABLE_ROW_CLASS_NAME + '-first' : '')
            + (last ? ' ' + TABLE_ROW_CLASS_NAME + '-last' : '')
            + (click ? ' ' + TABLE_ROW_CLASS_NAME + '-clickable' : '')
        }
            {...trProps}
        >{children}</tr>
    );
}
