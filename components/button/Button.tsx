// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { KeyboardEvent, Component, Children, MouseEvent, RefObject } from 'react';
import { UserInterfaceClassName } from "../constants/UserInterfaceClassName";
import { EventCallback, VoidCallback } from "../../../core/interfaces/callbacks";
import { stringifyStyleScheme, StyleScheme } from "../../types/StyleScheme";
import { ThemeService } from "../../services/ThemeService";
import { ButtonType } from "./types/ButtonType";
import { ButtonStyle } from "./types/ButtonStyle";
import { LogService } from "../../../core/LogService";
import './Button.scss';

const LOG = LogService.createLogger('Button');

export interface ButtonState {
}

export interface ButtonClickCallback {
    (): void;
}

export interface ButtonProps {

    readonly className?: string;
    readonly themeStyle?: StyleScheme;
    readonly style?: ButtonStyle;
    readonly type: ButtonType;
    readonly click: ButtonClickCallback;
    readonly focus?: VoidCallback;
    readonly blur?: VoidCallback;
    readonly keyDown?: EventCallback<KeyboardEvent>;
    readonly buttonRef?: RefObject<HTMLButtonElement>;
    readonly enabled?: boolean;

}

export interface OnClickCallback<T> {
    (event: MouseEvent<T>): void;
}

export class Button extends Component<ButtonProps, ButtonState> {

    public static defaultProps: Partial<ButtonProps> = {
        type: ButtonType.DEFAULT
    };

    private readonly _handleClickCallback: OnClickCallback<HTMLButtonElement>;

    public constructor (props: ButtonProps) {

        super(props);

        this.state = {};

        this._handleClickCallback = this._onClick.bind(this);

    }

    public render () {

        const childCount = Children.count(this.props.children);

        const buttonProps: {
            onBlur?: any,
            onFocus?: any,
            onKeyDown?: any,
            ref?: any,
            disabled?: any
        } = {};

        const blurCallback = this.props?.blur;
        if ( blurCallback ) {
            buttonProps.onBlur = () => blurCallback();
        }

        const focusCallback = this.props?.focus;
        if ( focusCallback ) {
            buttonProps.onFocus = () => focusCallback();
        }

        const buttonRef = this.props?.buttonRef;
        if ( buttonRef ) {
            buttonProps.ref = buttonRef;
        }

        const keyDownCallback = this.props?.keyDown;
        if ( keyDownCallback ) {
            buttonProps.onKeyDown = keyDownCallback;
        }

        const enabled = this.props?.enabled ?? true;
        if ( !enabled ) {
            buttonProps.disabled = true;
        }

        const buttonStyle = this.props?.style ?? ButtonStyle.SECONDARY;
        const styleScheme = this.props?.themeStyle ?? ThemeService.getStyleScheme();

        return (
            <button
                className={
                    UserInterfaceClassName.BUTTON
                    + ` ${UserInterfaceClassName.BUTTON}-count-${childCount}`
                    + ` ${UserInterfaceClassName.BUTTON}-${buttonStyle}`
                    + ` ${UserInterfaceClassName.BUTTON}-style-${stringifyStyleScheme(styleScheme)}`
                    + ` ${UserInterfaceClassName.BUTTON}-${enabled ? 'enabled' : 'disabled'}`
                    + (this.props.className ? ` ${this.props.className}` : '')
                }
                type={this.props.type}
                onClick={this._handleClickCallback}
                {...buttonProps}
            >{this.props.children}</button>
        );
    }

    private _onClick (event: MouseEvent<HTMLButtonElement>) {

        if ( event ) {
            event.preventDefault();
            event.stopPropagation();
        }

        if ( this.props.click ) {
            try {
                LOG.debug(`Triggering click handler`);
                this.props.click();
            } catch (err) {
                LOG.error('Error in click callback: ', err);
            }
        } else {
            LOG.warn(`No click handler defined`);
        }

    }

}


