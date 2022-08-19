// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ReactNode } from "react";
import { SUBMIT_BUTTON_CLASS_NAME } from "../../constants/hgClassName";
import { Button } from "../button/Button";
import { ButtonType } from "../button/types/ButtonType";
import { ButtonStyle } from "../button/types/ButtonStyle";

export interface SubmitButtonProps {
    readonly className ?: string;
    readonly children  ?: ReactNode;
    readonly style  ?: ButtonStyle;
}

export function SubmitButton (props: SubmitButtonProps) {
    const className = props?.className;
    const style = props?.style ?? ButtonStyle.PRIMARY;
    const children = props?.children;
    return (
        <Button
            type={ButtonType.SUBMIT}
            style={style}
            className={
                SUBMIT_BUTTON_CLASS_NAME
                + (className? ` ${className}` : '')
            }
        >{children}</Button>
    );
}
