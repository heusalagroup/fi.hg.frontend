// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { TABLE_HEADER_CLASS_NAME } from "../../constants/hgClassName";
import { ReactNode } from "react";
import "./TableHeader.scss";

export interface TableHeaderProps {
    readonly className ?: string;
    readonly children ?: ReactNode;
}

export function TableHeader (props: TableHeaderProps) {
    const className = props?.className;
    const children = props?.children;
    return (
        <thead className={
            TABLE_HEADER_CLASS_NAME
            + (className? ` ${className}` : '')
        }>
            <tr className={TABLE_HEADER_CLASS_NAME+'-row'}>{children}</tr>
        </thead>
    );
}
