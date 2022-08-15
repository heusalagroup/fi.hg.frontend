// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { TABLE_HEADER_COLUMN_CLASS_NAME } from "../../constants/hgClassName";
import { ReactNode } from "react";

export interface TableHeaderColumnProps {
    readonly className ?: string;
    readonly children ?: ReactNode;
}

export function TableHeaderColumn (props: TableHeaderColumnProps) {
    const className = props?.className;
    const children = props?.children;
    return (
        <td className={
            TABLE_HEADER_COLUMN_CLASS_NAME
            + (className? ` ${className}` : '')
        }>
            <div className={TABLE_HEADER_COLUMN_CLASS_NAME+'-content'}>{children}</div>
        </td>
    );
}
