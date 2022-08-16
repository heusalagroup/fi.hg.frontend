// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { TABLE_HEADER_COLUMN_CLASS_NAME } from "../../constants/hgClassName";
import { ReactNode } from "react";
import "./TableHeaderColumn.scss";

export interface TableHeaderColumnProps {
    readonly className ?: string;
    readonly children ?: ReactNode;
    readonly colSpan ?: number;
    readonly first ?: boolean;
    readonly last ?: boolean;
}

export function TableHeaderColumn (props: TableHeaderColumnProps) {
    const className = props?.className;
    const children = props?.children;
    const colSpan = props?.colSpan;
    const first = props?.first;
    const last = props?.last;
    return (
        <td className={
                TABLE_HEADER_COLUMN_CLASS_NAME
                + (className? ` ${className}` : '')
                + (first ? ' ' + TABLE_HEADER_COLUMN_CLASS_NAME + '-first' : '')
                + (last ? ' ' + TABLE_HEADER_COLUMN_CLASS_NAME + '-last' : '')
            }
            colSpan={colSpan}
        >
            <div className={TABLE_HEADER_COLUMN_CLASS_NAME+'-content'}>{children}</div>
        </td>
    );
}
