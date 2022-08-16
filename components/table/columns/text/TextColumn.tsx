// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { TIME_COLUMN_CLASS_NAME } from "../../../../constants/hgClassName";
import { TableColumn } from "../../TableColumn";
import { Loader } from "../../../loader/Loader";
import "./TextColumn.scss";

export interface TextColumnProps {
    readonly className ?: string;
    readonly value     ?: string;
}

export function TextColumn (props: TextColumnProps) {
    const className = props?.className;
    const value = props?.value;
    return (
        <TableColumn className={
            TIME_COLUMN_CLASS_NAME
            + (className? ` ${className}` : '')
        }>{value === undefined ? (
            <Loader />
        ) : (value)}</TableColumn>
    );
}
