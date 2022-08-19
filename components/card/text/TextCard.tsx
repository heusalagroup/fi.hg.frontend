// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { TEXT_CARD_CLASS_NAME } from "../../../constants/hgClassName";
import { Card } from "../Card";
import "./TextCard.scss";

export interface TextCardProps {
    readonly className?: string;
    readonly label?: string;
    readonly value?: string;
}

export function TextCard (props: TextCardProps) {
    const className = props?.className;
    const label = props?.label;
    const value = props?.value ?? '';
    return (
        <Card
            className={
                TEXT_CARD_CLASS_NAME
                + (className ? ` ${className}` : '')
            }
            label={label}
        >{value}</Card>
    );
}
