// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { CARD_GRID_CLASS_NAME } from "../../constants/hgClassName";
import { ReactNode } from "react";
import "./CardGrid.scss";

export interface CardGridProps {
    readonly className ?: string;
    readonly children ?: ReactNode;
}

export function CardGrid (props: CardGridProps) {
    const className = props?.className;
    const children = props?.children;
    return (
        <div className={
            CARD_GRID_CLASS_NAME
            + (className? ` ${className}` : '')
        }>{children}</div>
    );
}
