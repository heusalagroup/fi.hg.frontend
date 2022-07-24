// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2020-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { MouseEvent, useCallback } from "react";
import { ToggleOffIcon, ToggleOnIcon } from "./assets";
import { TOGGLE_CLASS_NAME } from "../../constants/hgClassName";
import { ChangeCallback } from "../../../core/interfaces/callbacks";
import { useFieldChangeCallback } from "../../hooks/field/useFieldChangeCallback";
import "./Toggle.scss";

export type ToggleChangeCallback = ChangeCallback<boolean>;

export interface ToggleProps {
    readonly className?: string;
    readonly value: boolean;
    readonly change?: ChangeCallback<boolean>;
}

export function Toggle (props: ToggleProps) {

    const className = props?.className;
    const propsValue = props?.value;
    const propsChange = props?.change;

    const Icon = propsValue ? ToggleOnIcon : ToggleOffIcon;

    const changeCallback = useFieldChangeCallback<boolean>(
        'Toggle',
        propsChange
    );

    const onClickCallback = useCallback(
        (e: MouseEvent<HTMLDivElement>) => {
            if ( e ) {
                e.preventDefault();
                e.stopPropagation();
            }
            changeCallback( !propsValue );
        },
        [
            propsValue,
            changeCallback
        ]
    );

    return (
        <div
            className={
                TOGGLE_CLASS_NAME
                + ' ' + TOGGLE_CLASS_NAME + (propsValue ? '-enabled' : '-disabled')
                + (className ? ` ${className}` : '')
            }
            onClick={onClickCallback}
        ><Icon /></div>
    );

}
