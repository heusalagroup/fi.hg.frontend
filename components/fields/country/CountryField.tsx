// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { ChangeEvent , Component } from 'react';
import { UserInterfaceClassName } from "../../constants/UserInterfaceClassName";
import { CountryFieldModel } from "../../../types/items/CountryFieldModel";
import { FieldProps } from '../FieldProps';
import { FormFieldState,  stringifyFormFieldState } from "../../../types/FormFieldState";
import { LogService } from "../../../../core/LogService";
import { ThemeService } from "../../../services/ThemeService";
import { stringifyStyleScheme } from "../../../types/StyleScheme";
import { CountryCode, isCountryCode, parseCountryCode } from "../../../../core/types/CountryCode";
import { CountryAutoCompleteMapping } from "../../../../core/CountryUtils";
import './CountryField.scss';

const LOG = LogService.createLogger('CountryField');
const COMPONENT_CLASS_NAME = UserInterfaceClassName.COUNTRY_FIELD;
const COMPONENT_INPUT_TYPE = "text";

export interface CountryFieldState {
    readonly value      : string;
    readonly fieldState : FormFieldState;
}

export interface CountryFieldProps extends FieldProps<CountryFieldModel, CountryCode> {
    readonly autoCompleteValues : CountryAutoCompleteMapping;
}

export interface OnChangeCallback<T> {
    (event: ChangeEvent<T>): void;
}

/**
 * This component is not implemented yet.
 */
export class CountryField extends Component<CountryFieldProps, CountryFieldState> {

    private static _defaultCountryCode : CountryCode = CountryCode.FI;

    private readonly _handleChangeCallback : OnChangeCallback<HTMLInputElement>;
    private _fieldState : FormFieldState;

    public constructor (props: CountryFieldProps) {
        super(props);
        this._fieldState = FormFieldState.CONSTRUCTED;
        this.state = {
            value      : props.value ?? CountryField._defaultCountryCode,
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
        prevProps: Readonly<CountryFieldProps>,
        prevState: Readonly<CountryFieldState>,
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
        const placeholder = this.props.placeholder ?? this.props.model?.placeholder;
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
            this.props?.model?.required ?? false
        );
        LOG.debug(`${this.getIdentifier()}: _updateFieldState: isValid: `, isValid);

        this._setFieldState( isValid ? FormFieldState.VALID : FormFieldState.INVALID );

    }

    private _updateValueState () {
        const value : string = this.props?.value ?? '';
        this._setStateValue(value);
    }

    /**
     *
     * @param stateValueString
     * @param propValue
     * @param required
     * @private
     */
    private _validateWithStateValue (
        stateValueString  : string,
        propValue         : CountryCode | undefined,
        required          : boolean
    ) : boolean {
        LOG.debug(`${this.getIdentifier()}: _validateWithStateValue: stateValueString = `, stateValueString);
        if ( !this._validateValue(propValue, required) ) {
            LOG.debug(`${this.getIdentifier()}: _validateWithStateValue: propValue = `, propValue);
            return false;
        }
        const parsedStateValue : CountryCode | undefined = parseCountryCode(stateValueString);
        LOG.debug(`${this.getIdentifier()}: _validateWithStateValue: parsedStateValue = `, parsedStateValue);
        return this._validateValue(parsedStateValue, required);
    }

    private _validateValue (
        internalValue : CountryCode | undefined,
        required      : boolean
    ) : boolean {
        if ( internalValue === undefined ) {
            LOG.debug(`${this.getIdentifier()}: _validateValue: required = `, required, internalValue);
            return !required;
        }
        LOG.debug(`${this.getIdentifier()}: _validateValue: internalValue = `, internalValue);
        return isCountryCode(internalValue);
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

        const valueString = event?.target?.value;
        const value : CountryCode | undefined = parseCountryCode( valueString );

        this._setStateValue(valueString ?? '' );

        if (this.props.change) {
            try {
                this.props.change(value);
            } catch (err) {
                LOG.error(`${this.getIdentifier()}: Error: `, err);
            }
        }

    }

}


