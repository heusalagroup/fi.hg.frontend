// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { Component , MouseEvent, ChangeEvent, RefObject , createRef } from 'react';
import { UserInterfaceClassName } from "../../constants/UserInterfaceClassName";
import { CheckboxFieldModel } from "../../../types/items/CheckboxFieldModel";
import { FieldProps } from '../FieldProps';
import { LogService } from "../../../../core/LogService";
import { FormFieldState,  stringifyFormFieldState } from "../../../types/FormFieldState";
import { ThemeService } from "../../../services/ThemeService";
import { stringifyStyleScheme } from "../../../types/StyleScheme";
import './CheckboxField.scss';

const LOG = LogService.createLogger('CheckboxField');

export interface CheckboxFieldState {
    readonly fieldState : FormFieldState;
    readonly value      : boolean;
}

export interface CheckboxFieldProps extends FieldProps<CheckboxFieldModel, boolean> {

}

export interface OnChangeCallback<T> {
    (event: ChangeEvent<T>) : void;
}

export interface OnMouseCallback<T> {
    (event: MouseEvent<T>) : void;
}

export class CheckboxField extends Component<CheckboxFieldProps, CheckboxFieldState> {

    private readonly _toggleCallback       : OnMouseCallback<HTMLLabelElement>;
    private readonly _handleChangeCallback : OnChangeCallback<HTMLInputElement>;
    private readonly _inputRef             : RefObject<HTMLInputElement>;

    private _fieldState : FormFieldState;


    public constructor(props: CheckboxFieldProps) {

        super(props);

        this._fieldState = FormFieldState.CONSTRUCTED;

        this.state = {
            value      : false,
            fieldState : this._fieldState
        };

        this._handleChangeCallback = this._onChange.bind(this);
        this._toggleCallback       = this._onToggleValue.bind(this);
        this._inputRef             = createRef();

    }

    public getKey () : string {
        return this.props?.model?.key ?? '';
    }

    public getLabel () : string {
        return this.props?.label ?? this.props.model?.label ?? '';
    }

    public getIdentifier () : string {
        return `#${this.getKey()}: "${this.getLabel()}"`;
    }

    public componentDidMount() {
        this._updateValueState();
        this._setFieldState(FormFieldState.MOUNTED);
        this._updateFieldState();
    }

    public componentDidUpdate(prevProps: Readonly<CheckboxFieldProps>, prevState: Readonly<CheckboxFieldState>, snapshot?: any) {

        if ( this.props.model !== prevProps.model || this.props.value !== prevProps.value ) {

            LOG.debug(`${this.getIdentifier()}: Update: `, prevProps, this.props);

            this._updateFieldState();
            if (this.state.value !== this.props.value) {
                this.setState(() => ({
                    value: this.props.value ?? false
                }), () => {
                    this._updateFieldState();
                });
            }

        } else {

            LOG.debug(`${this.getIdentifier()}: No change detected: `, prevProps, this.props);

        }

    }

    public componentWillUnmount (): void {
        this._setFieldState(FormFieldState.UNMOUNTED);
    }

    public render () {

        const label = this.props.label ?? this.props.model?.label;
        const fieldState = stringifyFormFieldState( this._fieldState );
        const styleScheme = this.props?.style ?? ThemeService.getStyleScheme();

        return (
            <label
                className={
                    UserInterfaceClassName.CHECKBOX_FIELD + ' ' + UserInterfaceClassName.FIELD
                    + ` ${UserInterfaceClassName.FIELD}-style-${stringifyStyleScheme(styleScheme)}`
                    + ` ${UserInterfaceClassName.FIELD}-state-${fieldState}`
                }
                onClick={this._toggleCallback}
            >
                <input
                    ref={this._inputRef}
                    className={
                        UserInterfaceClassName.CHECKBOX_FIELD+'-input'
                        + ` ${UserInterfaceClassName.FIELD}-input`
                    }
                    type="checkbox"
                    autoComplete="off"
                    checked={this.state.value}
                    onChange={this._handleChangeCallback}
                />
                {label ? (
                    <span className={
                        UserInterfaceClassName.CHECKBOX_FIELD+'-label'
                        + ` ${UserInterfaceClassName.FIELD}-label`
                    }>{label}</span>
                ) : null}
                {this.props.children}
            </label>
        );

    }


    private _updateValueState () {
        const value : boolean = this.props?.value ?? false;
        this._setStateValue(value);
    }

    private _setFieldState (value : FormFieldState) {

        LOG.debug(`${this.getIdentifier()}: _setFieldState: `, stringifyFormFieldState(value));

        this._fieldState = value;

        if (this.state.fieldState !== value) {
            this.setState({fieldState: value});
            LOG.debug(`${this.getIdentifier()}: Changed state as `, stringifyFormFieldState(value));
        }

        if (this.props?.changeState) {
            this.props.changeState(value);
        }

    }

    private _updateFieldState () {

        LOG.debug(`${this.getIdentifier()}: _updateFieldState: state: `, stringifyFormFieldState(this._fieldState));

        if (this._fieldState < FormFieldState.MOUNTED) return;
        if (this._fieldState >= FormFieldState.UNMOUNTED) return;

        const isValid = this._validateWithStateValue(
            this.state.value,
            this.props.value,
            this.props?.model?.required ?? false
        );
        LOG.debug(`${this.getIdentifier()}: _updateFieldState: isValid: `, isValid);

        this._setFieldState( isValid ? FormFieldState.VALID : FormFieldState.INVALID );

    }

    private _setStateValue (value: boolean) {
        if (value !== this.state.value) {
            this.setState({value}, () => {
                this._updateFieldState();
            });
        }
    }

    private _onChange (event: ChangeEvent<HTMLInputElement>) {

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const value : boolean = event?.target?.checked ?? false;
        LOG.debug(`${this.getIdentifier()}: _onChange: value = `, value);
        this._setValue(value);

    }

    private _onToggleValue (event: MouseEvent<HTMLLabelElement>) {

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        this._setValue(!this.state.value);

    }

    private _setValue (value: boolean) {

        LOG.debug(`${this.getIdentifier()}: _setValue: value = `, value);

        this._setStateValue(value);

        if (this.props.change) {
            try {
                this.props.change(value);
            } catch (err) {
                LOG.error(`${this.getIdentifier()}: Error in change props: `, err);
            }
        } else {
            LOG.warn(`${this.getIdentifier()}: No change props defined!`);
        }

    }

    private _validateWithStateValue (
        stateValue : boolean,
        propValue  : boolean | undefined,
        required   : boolean
    ) : boolean {

        LOG.debug(`${this.getIdentifier()}: _validateWithStateValue: stateValue = `, stateValue);

        if ( !this._validateValue(propValue, required) ) {
            LOG.debug(`${this.getIdentifier()}: _validateWithStateValue: propValue = `, propValue);
            return false;
        }

        if ( !this._validateValue(stateValue, required) ) {
            return false;
        }

        LOG.debug(`${this.getIdentifier()}: _validateWithStateValue: propValue = `, propValue);
        return stateValue === (propValue ?? false);

    }

    private _validateValue (
        internalValue : boolean | undefined,
        required      : boolean
    ) : boolean {
        LOG.debug(`${this.getIdentifier()}: _validateValue: `, required, internalValue);
        return required ? internalValue === true : true;
    }

}


