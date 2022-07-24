// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { Component } from "react";
import { VoidCallback } from "../../../core/interfaces/callbacks";
import { Button } from "../button/Button";
import { LogService } from "../../../core/LogService";
import { FORM_CONTROLS_CLASS_NAME } from "../../constants/hgClassName";
import "./FormControls.scss";

const LOG = LogService.createLogger('FormControls');

export interface FormControlsProps {

    readonly hasErrors   ?: boolean;
    readonly className   ?: string;
    readonly cancelLabel ?: string;
    readonly cancel      ?: VoidCallback;
    readonly submitLabel ?: string;
    readonly submit      ?: VoidCallback;

}

export interface FormControlsState {

}

export class FormControls extends Component<FormControlsProps, FormControlsState> {

    private readonly _cancelCallback : VoidCallback;
    private readonly _submitCallback : VoidCallback;

    public static defaultProps: Partial<FormControlsProps> = {};

    public constructor (props: FormControlsProps) {

        super(props);

        this._cancelCallback = this._onCancel.bind(this);
        this._submitCallback = this._onSubmit.bind(this);

    }

    public render () {

        const hasSubmit   : boolean = !!this.props?.submit;
        const hasCancel   : boolean = !!this.props?.cancel;
        const hasErrors   : boolean = !!this.props?.hasErrors;
        const submitLabel : string  = this.props?.submitLabel ?? 'Submit';
        const cancelLabel : string  = this.props?.cancelLabel ?? 'Cancel';

        return (
            <div className={
                FORM_CONTROLS_CLASS_NAME + ' ' + (this.props.className ?? '')
                + (hasErrors ? ' ' + FORM_CONTROLS_CLASS_NAME + '-with-errors' : '')
            }>

                <div className={FORM_CONTROLS_CLASS_NAME + '-content'}>{this.props.children}</div>

                {hasCancel ? (
                    <Button
                        className={
                              FORM_CONTROLS_CLASS_NAME + '-button '
                            + FORM_CONTROLS_CLASS_NAME + '-cancel-button'
                        }
                        click={this._cancelCallback}>{cancelLabel}</Button>
                ) : null}

                {hasSubmit ? (
                    <Button
                        className={
                              FORM_CONTROLS_CLASS_NAME + '-button '
                            + FORM_CONTROLS_CLASS_NAME + '-submit-button'
                        }
                        click={this._submitCallback}>{submitLabel}</Button>
                ) : null}

            </div>
        );

    }

    private _onCancel () {

        try {
            if (this.props?.cancel) {
                this.props?.cancel();
            } else {
                LOG.error(`_onCancel: No cancel prop defined`);
            }
        } catch (err) {
            LOG.error(`_onCancel: Error: `, err);
        }

    }

    private _onSubmit () {

        try {
            if (this.props?.submit) {
                this.props?.submit();
            } else {
                LOG.error(`_onSubmit: No submit prop defined`);
            }
        } catch (err) {
            LOG.error(`_onSubmit: Error: `, err);
        }

    }

}


