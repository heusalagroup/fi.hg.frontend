// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ReactNode } from "react";
import { SUBMIT_BUTTON_CLASS_NAME } from "../../constants/hgClassName";
import { Button } from "../button/Button";
import { ButtonType } from "../button/types/ButtonType";

export interface SubmitButtonProps {
    readonly className ?: string;
    readonly children  ?: ReactNode;
}

export function SubmitButton (props: SubmitButtonProps) {
    const className = props?.className;
    return (
        <Button
            type={ButtonType.SUBMIT}
            className={
                SUBMIT_BUTTON_CLASS_NAME
                + (className? ` ${className}` : '')
            }
        >{props.children}</Button>
    );
}
