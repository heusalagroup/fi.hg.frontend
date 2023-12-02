// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    KeyboardEvent,
    Children,
    MouseEvent,
    RefObject,
    ReactNode,
    useCallback,
    CSSProperties,
} from 'react';
import { EventCallback, VoidCallback } from "../../../core/interfaces/callbacks";
import { ButtonType } from "../../../core/frontend/button/ButtonType";
import { LogService } from "../../../core/LogService";
import { ButtonStyle } from "../../../core/frontend/button/ButtonStyle";
import { BUTTON_CLASS_NAME } from "../../constants/hgClassName";
import './Button.scss';

const LOG = LogService.createLogger('Button');

export interface ButtonProps {
    readonly className?: string;
    readonly type ?: ButtonType;
    readonly click ?: VoidCallback;
    readonly focus?: VoidCallback;
    readonly blur?: VoidCallback;
    readonly keyDown?: EventCallback<KeyboardEvent>;
    readonly buttonRef?: RefObject<HTMLButtonElement>;
    readonly style ?: ButtonStyle;
    readonly enabled?: boolean;
    readonly children?: ReactNode;
    readonly css?: CSSProperties | undefined;
}

export type ButtonClickCallback = VoidCallback;

export function Button (props: ButtonProps) {
    const type = props?.type ?? ButtonType.DEFAULT;
    const className = props?.className;
    const css = props?.css;
    const children = props?.children;
    const buttonStyle = props?.style ?? ButtonStyle.SECONDARY;
    const hasClick = !!props?.click;
    const click = props?.click;
    const childCount = Children.count(children);
    const buttonProps: {
        onBlur?: any,
        onFocus?: any,
        onKeyDown?: any,
        ref?: any,
        disabled?: any,
        onClick?: any
    } = {};

    const blurCallback = props?.blur;
    if ( blurCallback ) {
        buttonProps.onBlur = () => blurCallback();
    }

    const focusCallback = props?.focus;
    if ( focusCallback ) {
        buttonProps.onFocus = () => focusCallback();
    }

    const buttonRef = props?.buttonRef;
    if ( buttonRef ) {
        buttonProps.ref = buttonRef;
    }

    const keyDownCallback = props?.keyDown;
    if ( keyDownCallback ) {
        buttonProps.onKeyDown = keyDownCallback;
    }

    const enabled = props?.enabled ?? true;
    if ( !enabled ) {
        buttonProps.disabled = true;
    }

    const onClick = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {

            if ( event ) {
                event.preventDefault();
                event.stopPropagation();
            }

            if ( click ) {
                try {
                    LOG.debug(`Triggering click handler`);
                    click();
                } catch (err) {
                    LOG.error('Error in click callback: ', err);
                }
            } else {
                LOG.warn(`No click handler defined`);
            }

        },
        [
            click
        ]
    );

    if ( hasClick || type !== ButtonType.SUBMIT) {
        buttonProps.onClick = onClick;
    }

    return (
        <button
            className={
                BUTTON_CLASS_NAME
                + ` ${BUTTON_CLASS_NAME}-count-${childCount}`
                + ` ${BUTTON_CLASS_NAME}-${buttonStyle}`
                + ` ${BUTTON_CLASS_NAME}-${enabled ? 'enabled' : 'disabled'}`
                + (className ? ` ${className}` : '')
            }
            style={css}
            type={type}
            {...buttonProps}
        >{children}</button>
    );
}



