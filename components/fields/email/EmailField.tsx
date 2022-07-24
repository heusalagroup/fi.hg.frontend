// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { ReactNode } from 'react';
import { EmailFieldModel } from "../../../types/items/EmailFieldModel";
import { FormFieldState, stringifyFormFieldState } from "../../../types/FormFieldState";
import { ThemeService } from "../../../services/ThemeService";
import { stringifyStyleScheme, StyleScheme } from "../../../types/StyleScheme";
import { EMAIL_FIELD_CLASS_NAME, FIELD_CLASS_NAME } from "../../../constants/hgClassName";
import { useStringField } from "../../../hooks/field/useStringField";
import { FieldChangeCallback } from "../../../hooks/field/useFieldChangeCallback";
import './EmailField.scss';

const COMPONENT_CLASS_NAME = EMAIL_FIELD_CLASS_NAME;
const COMPONENT_INPUT_TYPE = "email";

export interface EmailFieldProps {
    readonly className   ?: string;
    readonly style       ?: StyleScheme;
    readonly label       ?: string;
    readonly placeholder ?: string;
    readonly model       ?: EmailFieldModel;
    readonly value       ?: string;
    readonly change      ?: FieldChangeCallback<string | undefined>;
    readonly changeState ?: FieldChangeCallback<FormFieldState>;
    readonly children    ?: ReactNode;
}

export function EmailField (props: EmailFieldProps) {

    const className = props?.className;
    const styleScheme = props?.style ?? ThemeService.getStyleScheme();
    const placeholder = props.placeholder ?? props.model?.placeholder;
    const label = props.label ?? props.model?.label ?? '';

    const {
        fieldState,
        value,
        onChangeCallback
    } = useStringField(
        label,
        props?.model?.key ?? '',
        props?.change,
        props?.changeState,
        props?.value,
        props?.model?.required ?? false,
        props?.model?.minLength,
        props?.model?.maxLength
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

