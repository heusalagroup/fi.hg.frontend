// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ReactNode, useRef, useEffect, useState, useCallback } from 'react';
import { IntegerFieldModel } from "../../../types/items/IntegerFieldModel";
import { LogService } from "../../../../core/LogService";
import { FormFieldState, stringifyFormFieldState } from "../../../types/FormFieldState";
import { ThemeService } from "../../../services/ThemeService";
import { stringifyStyleScheme, StyleScheme } from "../../../types/StyleScheme";
import {
    FIELD_CLASS_NAME,
    DECIMAL_FIELD_CLASS_NAME
} from "../../../constants/hgClassName";
import { FieldChangeCallback } from "../../../hooks/field/useFieldChangeCallback";
import { useDecimalField } from "../../../hooks/field/useDecimalField";
import './DecimalField.scss';
import { NumberFieldUtils } from '../../../../core/utils/NumberFieldUtils';

const LOG = LogService.createLogger('DecimalField');
const DEFAULT_PLACEHOLDER = '123.00';
const COMPONENT_CLASS_NAME = DECIMAL_FIELD_CLASS_NAME;
const COMPONENT_INPUT_TYPE = "text";

export interface DecimalFieldProps {
    readonly className?: string;
    readonly style?: StyleScheme;
    readonly label?: string;
    readonly placeholder?: string;
    readonly model?: IntegerFieldModel;
    readonly value?: number;
    readonly change?: FieldChangeCallback<number | undefined>;
    readonly changeState?: FieldChangeCallback<FormFieldState>;
    readonly children?: ReactNode;
}

export function DecimalField(props: DecimalFieldProps) {

    const className = props?.className;
    const styleScheme = props?.style ?? ThemeService.getStyleScheme();
    const placeholder = props.placeholder ?? props.model?.placeholder ?? DEFAULT_PLACEHOLDER;
    const label = props.label ?? props.model?.label ?? '';

    const inputReference = useRef<HTMLInputElement>(null);
    const [focus, setFocus] = useState(false);
    const [tempVal, setTempVal] = useState('');
    const [validation, setValidation] = useState(true);

    const {
        fieldState,
        onChangeCallback,
        value
    } = useDecimalField(
        label,
        props?.model?.key ?? '',
        props?.change,
        props?.changeState,
        props?.value,
        props?.model?.required ?? false,
        props?.model?.minValue,
        props?.model?.maxValue,
        toNumberClass,
        stringifyInteger,
        focus,
        tempVal
    );

    useEffect(() => {
        LOG.debug('debugging temp & internal value', tempVal, ' ', value)
        simpleDecimalValidationCallback()
    }, [tempVal]);

    const handleBlur = () => {
        setFocus(false);
    }
    const handleFocus = () => {
        setFocus(true);
    }

    const handleChange = (e: any) => {
        const value = e.target.value;
        const parsedTempValue = value.replace(',', '.')
        setTempVal(parsedTempValue)
        onChangeCallback(e)
    }
    const simpleDecimalValidationCallback = useCallback(
        () => {
            const regexVal = /[^0-9.]/g;
            const validated = regexVal.test(tempVal)
            if (validated) {
                setValidation(true)
                setTempVal(value)           // If validation ok, setting tempvalue to 'internal value' as a guard
            } else {
                setValidation(false)
            }
        },
        [
            tempVal,
            focus
        ]
    )

    return (
        <label
            className={
                `${COMPONENT_CLASS_NAME} ${FIELD_CLASS_NAME}`
                + ` ${FIELD_CLASS_NAME}-style-${stringifyStyleScheme(styleScheme)}`
                + ` ${FIELD_CLASS_NAME}-state-${stringifyFormFieldState(fieldState)}`
                + ` ${className ? ` ${className}` : ''}`
            }
        >
            {label ? (
                <span
                    className={
                        COMPONENT_CLASS_NAME + '-label'
                        + ` ${FIELD_CLASS_NAME}-label`
                    }
                >{label}</span>
            ) : null}
            <input
                className={
                    COMPONENT_CLASS_NAME + '-input'
                    + ` ${FIELD_CLASS_NAME}-input`
                    + ` ${validation ? 'error' : ''}`
                }
                ref={inputReference}
                onFocus={handleFocus}
                onBlur={handleBlur}
                type={COMPONENT_INPUT_TYPE}
                autoComplete="off"
                placeholder={placeholder}
                value={tempVal}                 
                onChange={handleChange}
                readOnly={props?.change === undefined}
            />
            {props?.children}
        </label>
    );

}

const toNumberClass = NumberFieldUtils.toNumber         // toNumber moved to core/utils


function stringifyInteger(value: number | undefined): string {
    return `${value ?? ''}`;
}