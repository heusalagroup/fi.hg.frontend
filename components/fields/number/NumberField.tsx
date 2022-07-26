import React, { ReactNode, useState } from 'react';
import PropTypes from "prop-types";
import { IntegerFieldModel } from "../../../types/items/IntegerFieldModel";
import { LogService } from "../../../../core/LogService";
import { isSafeInteger, trim } from "../../../../core/modules/lodash";
import { FormFieldState, stringifyFormFieldState } from "../../../types/FormFieldState";
import { ThemeService } from "../../../services/ThemeService";
import { stringifyStyleScheme, StyleScheme } from "../../../types/StyleScheme";
import {
    FIELD_CLASS_NAME,
    INTEGER_FIELD_CLASS_NAME
} from "../../../constants/hgClassName";
import { useNumberField } from "../../../hooks/field/useNumberField";
import { FieldChangeCallback } from "../../../hooks/field/useFieldChangeCallback";
import './NumberField.scss';

const LOG = LogService.createLogger('IntegerField');
const DEFAULT_PLACEHOLDER = '123.00';
const COMPONENT_CLASS_NAME = INTEGER_FIELD_CLASS_NAME;
const COMPONENT_INPUT_TYPE = "text";



export interface NumberFieldProps {
    readonly className   ?: string;
    readonly style       ?: StyleScheme;
    readonly label       ?: string;
    readonly placeholder ?: string;
    readonly model       ?: IntegerFieldModel;
    readonly value       ?: number;
    readonly change      ?: FieldChangeCallback<number | undefined>;
    readonly changeState ?: FieldChangeCallback<FormFieldState>;
    readonly children    ?: ReactNode;
}

 export function NumberField (props: NumberFieldProps) {

    const className = props?.className;
    const styleScheme = props?.style ?? ThemeService.getStyleScheme();
    const placeholder = props.placeholder ?? props.model?.placeholder ?? DEFAULT_PLACEHOLDER;
    const label = props.label ?? props.model?.label ?? '';
    const [decimalValue, setDecimalValue] = useState<string>('');
    const [isValid, setIsValid] = useState<boolean>(true);

    const {
        fieldState,
        value = decimalValue,
        onChangeCallback
    } = useNumberField(
        label,
        props?.model?.key ?? '',
        props?.change,
        props?.changeState,
        props?.value,
        props?.model?.required ?? false,
        props?.model?.minValue,
        props?.model?.maxValue,
        toNumber,
        stringifyInteger
    );

    const onChangeHandler = (event:any) =>  {
        let eventVal = event.target.value.replace(',', '.').replace(/ /g, ''); //chained for readability
        let validInput = eventVal.replace(/\s\[A-Za-z]/g, ''); 
        let regexValidation = /^\d+\.?(?:\d{1,2})?$/; // change decimal digit count here
        
        if (!isNaN(validInput) && !isNaN(parseFloat(validInput))) {
            setDecimalValue(validInput);
        }   else {
            setDecimalValue(eventVal);
        }
        
        if (isNaN(parseFloat(eventVal)) && eventVal.length > 0) {
            setIsValid(false);
        }else if (regexValidation.test(eventVal) || eventVal.length <= 1){
            setIsValid(true);
        } else {
            setIsValid(false);
        }
        
        onChangeCallback(event) // Only changes value if integer

        toNumber(decimalValue) // returns false if decimal
    }


    return (
        <label
            className={
                `${COMPONENT_CLASS_NAME} ${FIELD_CLASS_NAME}`
                + ` ${FIELD_CLASS_NAME}-style-${stringifyStyleScheme(styleScheme)}`
                + ` ${FIELD_CLASS_NAME}-state-${stringifyFormFieldState(fieldState)}`
                + ` ${className ? ` ${className}` : ''}`
            }
        >
             {isValid ? '' : <label className='error'>Invalid Input</label>}
            {label ? (
                <span className={
                    COMPONENT_CLASS_NAME+'-label'
                    + ` ${FIELD_CLASS_NAME}-label`
                }>{label}</span>
            ) : null}
            <input
                className={
                    COMPONENT_CLASS_NAME+'-input'
                    + ` ${FIELD_CLASS_NAME}-input
                    + ${isValid ? '' : ' error'}`
                }
                type={COMPONENT_INPUT_TYPE}
                autoComplete="off"
                placeholder={placeholder}
                value={decimalValue}
                onChange={onChangeHandler}
                readOnly={ props?.change === undefined }
            />
            {props?.children}
        </label>
    );

}

function toNumber (value : string | undefined) : number | undefined {
    try {
        if (value === undefined) return undefined;
        value = trim(value);

        if (value === '') return undefined;
        

        const parsedValue = parseFloat(value);

        if ( !isSafeInteger(parsedValue)) {
            return undefined;
        }

        return parsedValue;

    } catch (err) {
        LOG.warn(`Error while parsing string as integer "${value}": `, err);
        return undefined;
    }
}

function stringifyInteger (value: number | undefined) : string {
    return `${value ?? ''}`;
}

