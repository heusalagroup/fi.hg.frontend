// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { TABLE_ROW_CLASS_NAME } from "../../constants/hgClassName";
import { ReactNode } from "react";
import "./TableRow.scss";

export interface TableRowProps {
    readonly className ?: string;
    readonly children ?: ReactNode;
    readonly first ?: boolean;
    readonly last ?: boolean;
}

export function TableRow (props: TableRowProps) {
    const className = props?.className;
    const children = props?.children;
    const first = props?.first;
    const last = props?.last;
    return (
        <tr className={
            TABLE_ROW_CLASS_NAME
            + (className? ` ${className}` : '')
            + (first ? ' ' + TABLE_ROW_CLASS_NAME + '-first' : '')
            + (last ? ' ' + TABLE_ROW_CLASS_NAME + '-last' : '')
        }>{children}</tr>
    );
}
