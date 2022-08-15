// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { TABLE_COLUMN_CLASS_NAME } from "../../constants/hgClassName";
import { ReactNode } from "react";
import "./TableColumn.scss";

export interface TableColumnProps {
    readonly className ?: string;
    readonly children ?: ReactNode;
    readonly colSpan ?: number;
}

export function TableColumn (props: TableColumnProps) {
    const className = props?.className;
    const children = props?.children;
    const colSpan = props?.colSpan;
    return (
        <td className={
            TABLE_COLUMN_CLASS_NAME
            + (className? ` ${className}` : '')
        }
            colSpan={colSpan}
        >
            <div className={TABLE_COLUMN_CLASS_NAME+'-content'}>{children}</div>
        </td>
    );
}
