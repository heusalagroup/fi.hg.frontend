// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { ReactNode } from 'react';
import { CountryFieldModel } from "../../../types/items/CountryFieldModel";
import { FormFieldState, stringifyFormFieldState } from "../../../types/FormFieldState";
import { ThemeService } from "../../../services/ThemeService";
import { stringifyStyleScheme, StyleScheme } from "../../../types/StyleScheme";
import { CountryCode } from "../../../../core/types/CountryCode";
import { CountryAutoCompleteMapping } from "../../../../core/CountryUtils";
import { COUNTRY_FIELD_CLASS_NAME, FIELD_CLASS_NAME } from "../../../constants/hgClassName";
import { useCountryCodeField } from "../../../hooks/field/useCountryCodeField";
import { FieldChangeCallback } from "../../../hooks/field/useFieldChangeCallback";
import './CountryField.scss';

const COMPONENT_CLASS_NAME = COUNTRY_FIELD_CLASS_NAME;
const COMPONENT_INPUT_TYPE = "text";
const DEFAULT_COUNTRY_CODE : CountryCode = CountryCode.FI;

export interface CountryFieldProps {
    readonly className   ?: string;
    readonly style       ?: StyleScheme;
    readonly label       ?: string;
    readonly placeholder ?: string;
    readonly model       ?: CountryFieldModel;
    readonly value       ?: CountryCode;
    readonly change      ?: FieldChangeCallback<CountryCode | undefined>;
    readonly changeState ?: FieldChangeCallback<FormFieldState>;
    readonly autoCompleteValues : CountryAutoCompleteMapping;
    readonly children?: ReactNode;
}

/**
 * EXPERIMENTAL. This component might not be functional yet.
 */
export function CountryField (props: CountryFieldProps) {

    const className = props?.className;
    const styleScheme = props?.style ?? ThemeService.getStyleScheme();
    const placeholder = props.placeholder ?? props.model?.placeholder;
    const label = props.label ?? props.model?.label ?? '';

    const {
        fieldState,
        value,
        onChangeCallback
    } = useCountryCodeField(
        label,
        props?.model?.key ?? '',
        props?.change,
        props?.changeState,
        props?.value,
        props?.model?.required ?? false,
        props?.model?.minLength,
        props?.model?.maxLength,
        DEFAULT_COUNTRY_CODE
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
                <span className={
                    COMPONENT_CLASS_NAME+'-label'
                    + ` ${FIELD_CLASS_NAME}-label`
                }>{label}</span>
            ) : null}
            <input
                className={
                    COMPONENT_CLASS_NAME+'-input'
                    + ` ${FIELD_CLASS_NAME}-input`
                }
                type={COMPONENT_INPUT_TYPE}
                autoComplete="off"
                placeholder={placeholder}
                value={value}
                onChange={onChangeCallback}
                readOnly={ props?.change === undefined }
            />
            {props?.children}
        </label>
    );

}
