// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { CARD_CLASS_NAME } from "../../constants/hgClassName";
import { ReactNode } from "react";
import "./Card.scss";

export interface CardProps {
    readonly className ?: string;
    readonly label ?: string;
    readonly children ?: ReactNode;
}

export function Card (props: CardProps) {
    const className = props?.className;
    const children = props?.children;
    const label = props?.label;
    return (
        <div className={
            CARD_CLASS_NAME
            + (className? ` ${className}` : '')
        }>
            { label ? <div className={CARD_CLASS_NAME+'-label'}>{label}</div> : null }
            <div className={CARD_CLASS_NAME+'-content'}>{children}</div>
        </div>
    );
}
