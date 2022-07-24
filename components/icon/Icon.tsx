// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2020-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { ICON_CLASS_NAME } from "../../constants/hgClassName";
import { ReactNode } from "react";
import './Icon.scss';

export enum IconType {
    DEFAULT,
    CIRCLE
}

export interface IconProps {
    readonly className?: string;
    readonly type?: IconType;
    readonly children ?: ReactNode;
}

export function Icon (props: IconProps) {
    const type = props?.type ?? IconType.DEFAULT;
    const className = props?.className;
    return <div className={
        ICON_CLASS_NAME +
        (className ? ` ${className}` : '') +
        ' ' + getTypeClassName(type)
    }>{props.children}</div>;
}

function getTypeClassName (type : (IconType|undefined)) : string {
    switch (type) {
        case IconType.DEFAULT : return ICON_CLASS_NAME + '-type-default';
        case IconType.CIRCLE  : return ICON_CLASS_NAME + '-type-circle';
        default:                return '';
    }
}
