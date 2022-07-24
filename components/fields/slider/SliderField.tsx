// Copyright (c) 2020-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { Component, ChangeEvent } from 'react';
import { SelectFieldModel, SelectFieldItem} from "../../../types/items/SelectFieldModel";
import { FieldProps } from '../FieldProps';
import { LogService } from "../../../../core/LogService";
import { find, map } from "../../../../core/modules/lodash";
import { EventCallback } from "../../../../core/interfaces/callbacks";
import { FormFieldState,  stringifyFormFieldState } from "../../../types/FormFieldState";
import { ThemeService } from "../../../services/ThemeService";
import { stringifyStyleScheme } from "../../../types/StyleScheme";
import { FIELD_CLASS_NAME, SLIDER_FIELD_CLASS_NAME } from "../../../constants/hgClassName";
import './SliderField.scss';

const LOG = LogService.createLogger('SliderField');
const COMPONENT_CLASS_NAME = SLIDER_FIELD_CLASS_NAME;
const AUTOMATIC_FIELD_NAME_PREFIX = 'slider-field-';

export interface SliderFieldState {
    readonly fieldState  : FormFieldState;
    readonly name        : string;
}

export interface SliderFieldProps<T> extends FieldProps<SelectFieldModel<T>, T> {

    readonly values : SelectFieldItem<T>[];
    readonly name  ?: string;

}

export class SliderField extends Component<SliderFieldProps<any>, SliderFieldState> {

    private static _idSequence : number = 0;

    private _fieldState : FormFieldState;
    private readonly _id                  : number;
    private readonly _radioChangeCallback : EventCallback<ChangeEvent<HTMLInputElement>>;


    public constructor (props: SliderFieldProps<any>) {
        super(props);
        this._fieldState = FormFieldState.CONSTRUCTED;
        SliderField._idSequence += 1;
        this._id = SliderField._getNextId();
        const initialName = this._getInitialName();
        this.state = {
            name: initialName,
            fieldState: this._fieldState
        };
        this._radioChangeCallback = this._onRadioChange.bind(this);
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
        this._updateNameToStateIfChanged();
        this._setFieldState(FormFieldState.MOUNTED);
        this._updateFieldState();
    }

    public componentDidUpdate (
        prevProps: Readonly<SliderFieldProps<any>>,
        prevState: Readonly<SliderFieldState>,
        snapshot?: any
    ) {
        this._updateNameToStateIfChanged();
        if (prevProps.value !== this.props.value
            || prevProps.values !== this.props.values
            || prevProps.model !== this.props.model
        ) {
            this._updateFieldState();
        }
    }

    public componentWillUnmount (): void {
        this._setFieldState(FormFieldState.UNMOUNTED);
    }

    public render () {

        const sliderName = this.state.name;

        const label       = this.props?.label          ?? this.props.model?.label;
        const value       : any = this.props?.value    ?? undefined;

        LOG.debug(`${this.getIdentifier()}: Selected value: `, value);

        const selectItems : SelectFieldItem<any>[] = this._getValues();

        const selectedItem : SelectFieldItem<any> | undefined = find(selectItems, (item : SelectFieldItem<any>) : boolean => {
            return item?.value === value;
        });

        LOG.debug(`${this.getIdentifier()}: Selected item: `, selectedItem);

        // const selectedItemLabel : string = selectedItem?.label ?? '';

        const itemCount = selectItems.length;
        const fieldState  = stringifyFormFieldState( this._fieldState );

        const styleScheme = this.props?.style ?? ThemeService.getStyleScheme();

        return (
            <div className={
                COMPONENT_CLASS_NAME
                + ' ' + (this.props.className ?? '')
                + ' ' + FIELD_CLASS_NAME
                + ` ${FIELD_CLASS_NAME}-style-${stringifyStyleScheme(styleScheme)}`
                + ` ${FIELD_CLASS_NAME}-state-${fieldState}`
            }>

                {label ? (
                    <label className={
                        COMPONENT_CLASS_NAME+'-label'
                        + ` ${FIELD_CLASS_NAME}-label`
                    }>{label}</label>
                ) : null}

                <div className={
                    COMPONENT_CLASS_NAME + '-options'
                    + ` ${FIELD_CLASS_NAME}-options`
                }>
                    {map(selectItems, (item : SelectFieldItem<any>, itemIndex: number) => {

                        const itemLabel    : string  = item?.label ?? '';
                        const itemValue    : any     = item?.value ?? undefined;
                        const itemSelected : boolean = selectedItem ? itemValue === selectedItem?.value : false;

                        LOG.debug(`${this.getIdentifier()}: item: `, itemLabel, itemValue, itemSelected);

                        const itemProps : {checked?: boolean} = {};
                        if (itemSelected) {
                            itemProps.checked = true;
                        }

                        return (
                            <label
                                key={`slider-${this._id}-label-${itemIndex}`}
                                className={
                                    COMPONENT_CLASS_NAME + '-option'
                                    + ` ${FIELD_CLASS_NAME}-option`
                                }
                            >

                                <div className={
                                    COMPONENT_CLASS_NAME + '-option-input'
                                    + ` ${FIELD_CLASS_NAME}-option-input`
                                }>
                                    <div className={
                                        COMPONENT_CLASS_NAME + '-option-input-fill '
                                        + ` ${FIELD_CLASS_NAME}-option-input-fill`
                                        + ' ' + COMPONENT_CLASS_NAME + '-option-input-fill-with-'
                                            + (itemIndex !== 0 ? 'line' : 'no-line')
                                    } />
                                    <input
                                        className={
                                            COMPONENT_CLASS_NAME+'-option-input-element'
                                            + ` ${FIELD_CLASS_NAME}-option-input-element`
                                        }
                                        type="radio"
                                        name={sliderName}
                                        value={`${itemIndex}`}
                                        onChange={this._radioChangeCallback}
                                        autoComplete="off"
                                        {...itemProps}
                                    />
                                    <div className={
                                        COMPONENT_CLASS_NAME + '-option-input-fill '
                                        + ` ${FIELD_CLASS_NAME}-option-input-fill`
                                        + ' ' + COMPONENT_CLASS_NAME + '-option-input-fill-with-'
                                        + (itemIndex !== itemCount - 1 ? 'line' : 'no-line')
                                    } />
                                </div>

                                <div className={
                                    COMPONENT_CLASS_NAME + '-option-label'
                                    + ` ${FIELD_CLASS_NAME}-option-label`
                                }>
                                    {itemLabel ? (
                                        <span className={
                                            COMPONENT_CLASS_NAME+'-option-label-text'
                                            + ` ${FIELD_CLASS_NAME}-option-label-text`
                                        }>{itemLabel}</span>
                                    ) : null}
                                </div>

                            </label>
                        );
                    })}
                </div>

            </div>
        );

    }


    private _setFieldState (value : FormFieldState) {

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

        if ( this._fieldState < FormFieldState.MOUNTED ) return;
        if ( this._fieldState >= FormFieldState.UNMOUNTED ) return;

        const currentValue : any | undefined = this.props.value;

        const items       : SelectFieldItem<any>[] = this._getValues();
        LOG.debug(`${this.getIdentifier()}: _updateFieldState: items: `, items);

        const item        : SelectFieldItem<any> | undefined = currentValue === undefined ? undefined : find(items, (i : SelectFieldItem<any>) => i?.value === currentValue);
        LOG.debug(`${this.getIdentifier()}: _updateFieldState: item: `, item);

        const isValid = this._validateWithStateValue(
            item?.value,
            this.props.value,
            this.props?.model?.required ?? false
        );
        LOG.debug(`${this.getIdentifier()}: _updateFieldState: isValid: `, isValid);

        this._setFieldState( isValid ? FormFieldState.VALID : FormFieldState.INVALID );

    }

    private _validateWithStateValue (
        stateValue : any,
        propValue  : number | undefined,
        required   : boolean
    ) : boolean {

        LOG.debug(`${this.getIdentifier()}: _validateWithStateValue: stateValue = `, stateValue);

        if ( !this._validateValue(propValue, required) ) {
            LOG.debug(`${this.getIdentifier()}: _validateWithStateValue: propValue = `, propValue);
            return false;
        }

        const parsedStateValue : any | undefined = stateValue;
        LOG.debug(`${this.getIdentifier()}: _validateWithStateValue: parsedStateValue = `, parsedStateValue);

        if ( parsedStateValue === undefined && !!stateValue ) {
            return false;
        }

        if ( !this._validateValue(parsedStateValue, required) ) {
            return false;
        }

        LOG.debug(`${this.getIdentifier()}: _validateWithStateValue: propValue = `, propValue);
        return parsedStateValue === propValue;

    }

    private _validateValue (
        internalValue : any | undefined,
        required      : boolean
    ) : boolean {

        LOG.debug(`${this.getIdentifier()}: _validateValue: internalValue = `, internalValue);

        if ( internalValue === undefined ) {
            LOG.debug(`${this.getIdentifier()}: _validateValue: required = `, required);
            return !required;
        }

        return true;

    }

    private _change (value: any) {

        LOG.debug(`${this.getIdentifier()}: _change: value = `, value);

        if (this.props.change) {
            try {
                this.props.change(value);
            } catch (err) {
                LOG.error('Error in change prop: ', err);
            }
        } else {
            LOG.warn(`${this.getIdentifier()}: No change prop defined!`);
        }

    }

    /**
     *
     * @param index
     * @private
     */
    private _selectItem (index: number) {

        LOG.debug(`${this.getIdentifier()}: _selectItem: Click on index `, index);

        const selectItems : SelectFieldItem<any>[] = this._getValues();

        if (index < selectItems.length) {

            const value = selectItems[index]?.value;

            this._change(value);

        } else {
            LOG.error('_selectItem: No item on index ', index);
        }

    }

    private _getValues () : SelectFieldItem<any>[] {
        return this.props?.values ?? this.props?.model?.values ?? [];
    }

    private _getInitialName () : string {
        return this.props?.name ?? `${AUTOMATIC_FIELD_NAME_PREFIX}${this._id}`;
    }

    private _updateNameToStateIfChanged () {
        const propName = this._getInitialName();
        if (propName !== this.state.name) {
            this.setState({name: propName});
        }
    }

    private _onRadioChange (event : ChangeEvent<HTMLInputElement>) {

        const valueString = event?.target?.value ?? '';
        LOG.debug(`${this.getIdentifier()}: _onRadioChange: valueString=`, valueString);
        const valueIndex = valueString ? parseInt(valueString, 10) : undefined;
        LOG.debug(`${this.getIdentifier()}: _onRadioChange: valueIndex=`, valueIndex);

        if (valueIndex !== undefined) {
            this._selectItem(valueIndex);
        } else {
            LOG.warn(`${this.getIdentifier()}: _onRadioChange: value invalid: `, valueString);
        }

    }


    private static _getNextId () : number {
        this._idSequence += 1;
        return this._idSequence;
    }

}


