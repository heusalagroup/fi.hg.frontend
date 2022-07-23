// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useNavigate } from "react-router-dom";
import { MouseEvent, ReactNode, useCallback } from "react";
import { BACK_BUTTON_CLASS_NAME, BUTTON_CLASS_NAME } from "../../../constants/hgClassName";

export interface BackButtonProps {
    readonly className ?: string;
    readonly children  ?: ReactNode;
}

export function BackButton (props: BackButtonProps) {

    const className = props?.className;
    const navigate = useNavigate();

    const onClick = useCallback(
        (event : MouseEvent<HTMLButtonElement>) => {

            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }

            navigate(-1);

        },
        [
            navigate
        ]
    );

    return (
        <button
            className={
                BACK_BUTTON_CLASS_NAME
                + " " + BUTTON_CLASS_NAME
                + (className? ` ${className}` : '')
            }
            onClick={onClick}
        >{props?.children}</button>
    );

}


