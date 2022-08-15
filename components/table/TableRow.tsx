// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { TABLE_ROW_CLASS_NAME } from "../../constants/hgClassName";
import "./TableRow.scss";
import { ReactNode } from "react";

export interface TableRowProps {
    readonly className ?: string;
    readonly children ?: ReactNode;
}

export function TableRow (props: TableRowProps) {
    const className = props?.className;
    const children = props?.children;
    return (
        <tr className={
            TABLE_ROW_CLASS_NAME
            + (className? ` ${className}` : '')
        }>{children}</tr>
    );
}
