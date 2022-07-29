// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ReactNode } from 'react';
import { IntegerFieldModel } from "../../../types/items/IntegerFieldModel";
import { LogService } from "../../../../core/LogService";
import { isSafeInteger, trim } from "../../../../core/modules/lodash";
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
import { isNaN } from "lodash";

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

export function DecimalField (props: DecimalFieldProps) {

    const className = props?.className;
    const styleScheme = props?.style ?? ThemeService.getStyleScheme();
    const placeholder = props.placeholder ?? props.model?.placeholder ?? DEFAULT_PLACEHOLDER;
    const label = props.label ?? props.model?.label ?? '';

    const {
        fieldState,
        value,
        onChangeCallback
    } = useDecimalField(
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
                }
                type={COMPONENT_INPUT_TYPE}
                autoComplete="off"
                placeholder={placeholder}
                value={value}
                onChange={onChangeCallback}
                readOnly={props?.change === undefined}
            />
            {props?.children}
        </label>
    );

}

function toNumber (value: string | undefined): number | undefined {
    try {
        if ( value === undefined ) return undefined;
        value = trim(value);

        if ( value === '' ) return undefined;

        const parsedValue = parseFloat(value);

        return isNaN(parsedValue) ? undefined : parsedValue;

    } catch (err) {
        LOG.warn(`Error while parsing string as integer "${value}": `, err);
        return undefined;
    }
}

function stringifyInteger (value: number | undefined): string {
    return `${value ?? ''}`;
}
