// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { ChangeEvent, Component } from 'react';
import { UserInterfaceClassName } from "../../constants/UserInterfaceClassName";
import { IntegerFieldModel } from "../../../types/items/IntegerFieldModel";
import { FieldProps } from '../FieldProps';
import { LogService } from "../../../../core/LogService";
import { isSafeInteger, trim } from "../../../../core/modules/lodash";
import { FormFieldState,  stringifyFormFieldState } from "../../../types/FormFieldState";
import { ThemeService } from "../../../services/ThemeService";
import { stringifyStyleScheme } from "../../../types/StyleScheme";
import './IntegerField.scss';

const LOG = LogService.createLogger('IntegerField');
const DEFAULT_PLACEHOLDER = '123';
const COMPONENT_CLASS_NAME = UserInterfaceClassName.INTEGER_FIELD;
const COMPONENT_INPUT_TYPE = "text";

export interface IntegerFieldState {
    readonly value      : string;
    readonly fieldState : FormFieldState;
}

export interface IntegerFieldProps extends FieldProps<IntegerFieldModel, number> {

}

export interface OnChangeCallback<T> {
    (event: ChangeEvent<T>): void;
}

export class IntegerField extends Component<IntegerFieldProps, IntegerFieldState> {

    private readonly _handleChangeCallback : OnChangeCallback<HTMLInputElement>;

    private _fieldState : FormFieldState;


    public constructor (props: IntegerFieldProps) {
        super(props);
        this._fieldState = FormFieldState.CONSTRUCTED;
        this.state = {
            value      : IntegerField.stringifyValue(props.value),
            fieldState : this._fieldState
        };
        this._handleChangeCallback = this._onChange.bind(this);
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

    public componentDidMount () {
        this._updateValueState();
        this._setFieldState(FormFieldState.MOUNTED);
        this._updateFieldState();
    }

    public componentDidUpdate (
        prevProps: Readonly<IntegerFieldProps>,
        prevState: Readonly<IntegerFieldState>,
        snapshot?: any
    ) {
        const valueChanged : boolean = prevProps.value !== this.props.value;
        if (valueChanged) {
            this._updateValueState();
        }
        if (valueChanged
            || prevProps.model !== this.props.model
        ) {
            this._updateFieldState();
        }
    }

    public componentWillUnmount (): void {
        this._setFieldState(FormFieldState.UNMOUNTED);
    }

    public render () {

        const label       = this.props.label       ?? this.props.model?.label;
        const placeholder = this.props.placeholder ?? this.props.model?.placeholder ?? DEFAULT_PLACEHOLDER;
        const fieldState  = stringifyFormFieldState(this._fieldState);
        const styleScheme = this.props?.style ?? ThemeService.getStyleScheme();

        return (
            <label
                className={
                    `${COMPONENT_CLASS_NAME} ${UserInterfaceClassName.FIELD}`
                    + ' ' + (this.props.className ?? '')
                    + ` ${UserInterfaceClassName.FIELD}-style-${stringifyStyleScheme(styleScheme)}`
                    + ` ${UserInterfaceClassName.FIELD}-state-${fieldState}`
                }
            >
                {label ? (
                    <span className={
                        COMPONENT_CLASS_NAME+'-label'
                        + ` ${UserInterfaceClassName.FIELD}-label`
                    }>{label}</span>
                ) : null}
                <input
                    className={
                        COMPONENT_CLASS_NAME+'-input'
                        + ` ${UserInterfaceClassName.FIELD}-input`
                    }
                    type={COMPONENT_INPUT_TYPE}
                    autoComplete="off"
                    placeholder={placeholder}
                    value={this.state.value}
                    onChange={this._handleChangeCallback}
                    readOnly={ this.props?.change === undefined }
                />
                {this.props.children}
            </label>
        );

    }


    private _setFieldState (value : FormFieldState) {

        this._fieldState = value;

        if ( this.state.fieldState !== value ) {
            this.setState({fieldState: value});
            LOG.debug(`${this.getIdentifier()}: Changed state as `, stringifyFormFieldState(value));
        }

        if ( this.props?.changeState ) {
            this.props.changeState(value);
        }

    }

    private _updateFieldState () {

        LOG.debug(`${this.getIdentifier()}: _updateFieldState: state: `, stringifyFormFieldState(this._fieldState));

        if ( this._fieldState < FormFieldState.MOUNTED ) return;
        if ( this._fieldState >= FormFieldState.UNMOUNTED ) return;

        const isValid = this._validateWithStateValue(
            this.state.value,
            this.props.value,
            this.props?.model?.required ?? false,
            this.props?.model?.minValue,
            this.props?.model?.maxValue
        );
        LOG.debug(`${this.getIdentifier()}: _updateFieldState: isValid: `, isValid);

        this._setFieldState( isValid ? FormFieldState.VALID : FormFieldState.INVALID );

    }

    private _updateValueState () {
        const value : string = IntegerField.stringifyValue(this.props?.value);
        this._setStateValue(value);
    }

    private _validateWithStateValue (
        stateValueString : string,
        propValue        : number | undefined,
        required         : boolean,
        minValue         : number | undefined,
        maxValue         : number | undefined
    ) : boolean {

        LOG.debug(`${this.getIdentifier()}: _validateWithStateValue: stateValueString = `, stateValueString);

        if ( !this._validateValue(propValue, required, minValue, maxValue) ) {
            LOG.debug(`${this.getIdentifier()}: _validateWithStateValue: propValue = `, propValue);
            return false;
        }

        const parsedStateValue : number | undefined = IntegerField.toInteger(stateValueString);
        LOG.debug(`${this.getIdentifier()}: _validateWithStateValue: parsedStateValue = `, parsedStateValue);

        if ( parsedStateValue === undefined && stateValueString.length >= 1 ) {
            return false;
        }

        if ( !this._validateValue(parsedStateValue, required, minValue, maxValue) ) {
            return false;
        }

        LOG.debug(`${this.getIdentifier()}: _validateWithStateValue: propValue = `, propValue);
        return parsedStateValue === propValue && (`${propValue ?? ''}` === stateValueString);

    }

    private _validateValue (
        internalValue : number | undefined,
        required      : boolean,
        minValue      : number | undefined,
        maxValue      : number | undefined
    ) : boolean {

        LOG.debug(`${this.getIdentifier()}: _validateValue: internalValue = `, internalValue);

        if ( internalValue === undefined ) {
            LOG.debug(`${this.getIdentifier()}: _validateValue: required = `, required);
            return !required;
        }

        LOG.debug(`${this.getIdentifier()}: _validateValue: minValue = `, minValue);
        LOG.debug(`${this.getIdentifier()}: _validateValue: maxValue = `, maxValue );

        if (minValue !== undefined && internalValue < minValue) {
            return false;
        }
        return !(maxValue !== undefined && internalValue > maxValue);

    }

    private _setStateValue (value: string) {
        if ( value !== this.state.value ) {
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

        const value = event?.target?.value ?? '';

        this._setStateValue(value);

        if (this.props.change) {
            try {
                this.props.change(IntegerField.toInteger(value));
            } catch (err) {
                LOG.error(`${this.getIdentifier()}: Error: `, err);
            }
        }

    }


    public static toInteger (value : string) : number | undefined {
        try {

            value = trim(value);
            if (value === '') return undefined;

            const parsedValue = parseInt(value, 10);

            if ( !isSafeInteger(parsedValue) ) {
                return undefined;
            }

            return parsedValue;

        } catch (err) {
            LOG.warn(`Error while parsing string as integer "${value}": `, err);
            return undefined;
        }
    }

    public static stringifyValue (value: number | undefined) : string {
        return `${value ?? ''}`;
    }

}


