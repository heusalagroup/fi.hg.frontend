// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    ReactNode
} from 'react';
import { TextFieldModel } from "../../../types/items/TextFieldModel";
import { FieldChangeCallback } from '../FieldProps';
import { FormFieldState } from "../../../types/FormFieldState";
import { ThemeService } from "../../../services/ThemeService";
import { stringifyStyleScheme, StyleScheme } from "../../../types/StyleScheme";
import {
    FIELD_CLASS_NAME,
    TEXT_FIELD_CLASS_NAME
} from "../../../constants/hgClassName";
import { useStringField } from "../../../hooks/field/useStringField";
import './TextField.scss';

const COMPONENT_CLASS_NAME = TEXT_FIELD_CLASS_NAME;
const COMPONENT_INPUT_TYPE = "text";
type InternalValueType = string;

export interface TextFieldProps {
    readonly className?: string;
    readonly style?: StyleScheme;
    readonly label?: string;
    readonly placeholder?: string;
    readonly model?: TextFieldModel;
    readonly value?: InternalValueType;
    readonly change?: FieldChangeCallback<InternalValueType | undefined>;
    readonly changeState?: FieldChangeCallback<FormFieldState>;
    readonly children?: ReactNode;
}

export function TextField (props: TextFieldProps) {

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
                + ` ${FIELD_CLASS_NAME}-state-${fieldState}`
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
            {props.children}
        </label>
    );

}
