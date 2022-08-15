// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { TABLE_COLUMN_CLASS_NAME } from "../../constants/hgClassName";
import { ReactNode } from "react";
import "./TableColumn.scss";

export interface TableColumnProps {
    readonly className ?: string;
    readonly children ?: ReactNode;
    readonly colSpan ?: number;
    readonly first ?: boolean;
    readonly last ?: boolean;
}

export function TableColumn (props: TableColumnProps) {
    const className = props?.className;
    const children = props?.children;
    const colSpan = props?.colSpan;
    const first = props?.first;
    const last = props?.last;
    return (
        <td className={
            TABLE_COLUMN_CLASS_NAME
            + (className? ` ${className}` : '')
            + (first ? ' ' + TABLE_COLUMN_CLASS_NAME + '-first' : '')
            + (last ? ' ' + TABLE_COLUMN_CLASS_NAME + '-last' : '')
        }
            colSpan={colSpan}
        >
            <div className={TABLE_COLUMN_CLASS_NAME+'-content'}>{children}</div>
        </td>
    );
}
