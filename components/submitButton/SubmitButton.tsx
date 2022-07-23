// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { UserInterfaceClassName } from "../constants/UserInterfaceClassName";
import { ReactNode } from "react";

export interface SubmitButtonProps {
    readonly className ?: string;
    readonly children  ?: ReactNode;
}

export function SubmitButton (props: SubmitButtonProps) {
    const className = props?.className;
    return (
        <button
            type={"submit"}
            className={
                UserInterfaceClassName.SUBMIT_BUTTON
                + (className? ` ${className}` : '')
            }
        >{props.children}</button>
    );
}
