// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { ChangeEvent, Component } from 'react';
import { UserInterfaceClassName } from "../../constants/UserInterfaceClassName";
import { JsonFieldModel } from "../../../types/items/JsonFieldModel";
import { FieldProps } from '../FieldProps';
import { FormFieldState,  stringifyFormFieldState } from "../../../types/FormFieldState";
import { LogService } from "../../../../core/LogService";
import { isEqual, trim } from "../../../../core/modules/lodash";
import { JsonAny,  parseJson, ReadonlyJsonAny } from "../../../../core/Json";
import { ThemeService } from "../../../services/ThemeService";
import { stringifyStyleScheme } from "../../../types/StyleScheme";
import './JsonField.scss';

const LOG = LogService.createLogger('JsonField');
const COMPONENT_CLASS_NAME = UserInterfaceClassName.JSON_FIELD;

export interface JsonFieldState {
    readonly value      : string;
    readonly fieldState : FormFieldState;
}

export interface JsonFieldProps extends FieldProps<JsonFieldModel, JsonAny|ReadonlyJsonAny> {

}

export interface OnChangeCallback<T> {
    (event: ChangeEvent<T>): void;
}

export class JsonField extends Component<JsonFieldProps, JsonFieldState> {

    private readonly _handleChangeCallback : OnChangeCallback<HTMLTextAreaElement>;

    private _fieldState : FormFieldState;


    public constructor (props: JsonFieldProps) {
        super(props);
        this._fieldState = FormFieldState.CONSTRUCTED;
        this.state = {
            value: JsonField.getInternalValueString(props?.value as ReadonlyJsonAny),
            fieldState: this._fieldState
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

    public static getInternalValueString (value: ReadonlyJsonAny | undefined) : string {
        try {
            if (value === undefined) {
                return '';
            }
            return value ? JSON.stringify(value, null, 2) : ''
        } catch(err) {
            LOG.error(`Could not stringify value as string: `, err);
            return '';
        }
    }

    public componentDidMount () {
        this._updateValueState();
        this._setFieldState(FormFieldState.MOUNTED);
        this._updateFieldState();
    }

    public componentDidUpdate (
        prevProps: Readonly<JsonFieldProps>,
        prevState: Readonly<JsonFieldState>,
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
                <textarea
                    className={
                        COMPONENT_CLASS_NAME+'-input'
                        + ` ${UserInterfaceClassName.FIELD}-input`
                    }
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
            this.props.value as ReadonlyJsonAny,
            this.props?.model?.required ?? false,
            this.props?.model?.minLength ?? 0,
            this.props?.model?.maxLength
        );
        LOG.debug(`${this.getIdentifier()}: _updateFieldState: isValid: `, isValid);

        this._setFieldState( isValid ? FormFieldState.VALID : FormFieldState.INVALID );

    }

    private _validateWithStateValue (
        stateValueString : string,
        propValue        : ReadonlyJsonAny | undefined,
        required         : boolean,
        minLength        : number,
        maxLength        : number | undefined
    ) : boolean {

        LOG.debug(`${this.getIdentifier()}: _validateWithStateValue: stateValueString = `, stateValueString);

        if ( !this._validateValue(propValue, required, minLength, maxLength) ) {
            LOG.debug(`${this.getIdentifier()}: _validateWithStateValue: propValue = `, propValue);
            return false;
        }

        const parsedStateValue : ReadonlyJsonAny | undefined = parseJson(stateValueString) as ReadonlyJsonAny | undefined;
        LOG.debug(`${this.getIdentifier()}: _validateWithStateValue: parsedStateValue = `, parsedStateValue);

        if ( parsedStateValue === undefined && stateValueString.length >= 1 ) {
            return false;
        }

        if ( !this._validateValue(parsedStateValue, required, minLength, maxLength) ) {
            return false;
        }

        LOG.debug(`${this.getIdentifier()}: _validateWithStateValue: propValue = `, propValue);
        return isEqual(parsedStateValue, propValue);

    }

    private _validateValue (
        internalValue : ReadonlyJsonAny | undefined,
        required      : boolean,
        minLength     : number,
        maxLength     : number | undefined
    ) : boolean {

        LOG.debug(`${this.getIdentifier()}: _validateValue: internalValue = `, internalValue);

        if ( internalValue === undefined ) {
            LOG.debug(`${this.getIdentifier()}: _validateValue: required = `, required);
            return !required;
        }

        if (required && minLength === 0) {
            minLength = 1;
        }

        const string = JsonField.getInternalValueString(internalValue);

        const len = string.length;
        LOG.debug(`${this.getIdentifier()}: _validateValue: len = `, len, string);
        LOG.debug(`${this.getIdentifier()}: _validateValue: minLength = `, minLength);
        LOG.debug(`${this.getIdentifier()}: _validateValue: maxLength = `, maxLength);

        if ( len < minLength ) return false;
        return !(maxLength !== undefined && len > maxLength);

    }

    private _updateValueState () {
        this._setStateValue(JsonField.getInternalValueString(this.props?.value as ReadonlyJsonAny));
    }

    private _setStateValue (value: string) {
        if ( trim(value) !== trim(this.state.value) ) {
            this.setState({value}, () => {
                this._updateFieldState();
            });
        }
    }

    private _onChange (event: ChangeEvent<HTMLTextAreaElement>) {

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const value = event?.target?.value ?? '';

        this._setStateValue(value);

        if (this.props.change) {
            const parsedValue = parseJson(value) as ReadonlyJsonAny | undefined;
            try {
                this.props.change(parsedValue);
            } catch (err) {
                LOG.error(`${this.getIdentifier()}: Error: `, err);
            }
        }

    }

}


