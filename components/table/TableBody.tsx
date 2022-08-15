// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ReactNode } from "react";
import { TABLE_BODY_CLASS_NAME } from "../../constants/hgClassName";
import "./TableBody.scss";

export interface TableBodyProps {
    readonly className ?: string;
    readonly children ?: ReactNode;
}

export function TableBody (props: TableBodyProps) {
    const className = props?.className;
    const children = props?.children;
    return (
        <tbody className={
            TABLE_BODY_CLASS_NAME
            + (className? ` ${className}` : '')
        }>{children}</tbody>
    );
}
