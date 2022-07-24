// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { JsonFieldModel } from "../../../types/items/JsonFieldModel";
import { FormFieldState, stringifyFormFieldState } from "../../../types/FormFieldState";
import { JsonAny, ReadonlyJsonAny } from "../../../../core/Json";
import { ThemeService } from "../../../services/ThemeService";
import { stringifyStyleScheme, StyleScheme } from "../../../types/StyleScheme";
import {
    FIELD_CLASS_NAME,
    JSON_FIELD_CLASS_NAME
} from "../../../constants/hgClassName";
import { useJsonField } from "../../../hooks/field/useJsonField";
import { ReactNode } from "react";
import './JsonField.scss';
import { FieldChangeCallback } from "../../../hooks/field/useFieldChangeCallback";

const COMPONENT_CLASS_NAME = JSON_FIELD_CLASS_NAME;

export interface JsonFieldProps {
    readonly className   ?: string;
    readonly style       ?: StyleScheme;
    readonly label       ?: string;
    readonly placeholder ?: string;
    readonly model       ?: JsonFieldModel;
    readonly value       ?: ReadonlyJsonAny;
    readonly change      ?: FieldChangeCallback<JsonAny|ReadonlyJsonAny | undefined>;
    readonly changeState ?: FieldChangeCallback<FormFieldState>;
    readonly children?: ReactNode;
}

export function JsonField (props: JsonFieldProps) {

    const className = props?.className;
    const styleScheme = props?.style ?? ThemeService.getStyleScheme();
    const placeholder = props.placeholder ?? props.model?.placeholder;
    const label = props.label ?? props.model?.label ?? '';

    const {
        fieldState,
        value,
        onChangeCallback
    } = useJsonField(
        label,
        props?.model?.key ?? '',
        props?.change,
        props?.changeState,
        props?.value,
        props?.model?.required ?? false,
        props?.model?.minLength,
        props?.model?.maxLength
    );

    // FIXME: This could use same implementation as TextAreaField's label
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
            <textarea
                className={
                    COMPONENT_CLASS_NAME+'-input'
                    + ` ${FIELD_CLASS_NAME}-input`
                }
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
