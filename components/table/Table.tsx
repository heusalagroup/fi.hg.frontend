// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { TABLE_CLASS_NAME } from "../../constants/hgClassName";
import { ReactNode } from "react";
import "./Table.scss";

export interface TableProps {
    readonly className ?: string;
    readonly children ?: ReactNode;
}

export function Table (props: TableProps) {
    const className = props?.className;
    const children = props?.children;
    return (
        <table className={
            TABLE_CLASS_NAME
            + (className? ` ${className}` : '')
        }>{children}</table>
    );
}
