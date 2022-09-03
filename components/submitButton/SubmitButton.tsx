// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ReactNode } from "react";
import { SUBMIT_BUTTON_CLASS_NAME } from "../../constants/hgClassName";
import { Button } from "../button/Button";
import { ButtonType } from "../../../core/frontend/button/ButtonType";
import { ButtonStyle } from "../../../core/frontend/button/ButtonStyle";

export interface SubmitButtonProps {
    readonly className ?: string;
    readonly children  ?: ReactNode;
    readonly style  ?: ButtonStyle;
    readonly enabled?: boolean;
}

export function SubmitButton (props: SubmitButtonProps) {
    const className = props?.className;
    const style = props?.style ?? ButtonStyle.PRIMARY;
    const enabled = props?.enabled;
    const children = props?.children;
    return (
        <Button
            type={ButtonType.SUBMIT}
            style={style}
            enabled={enabled}
            className={
                SUBMIT_BUTTON_CLASS_NAME
                + (className? ` ${className}` : '')
            }
        >{children}</Button>
    );
}
