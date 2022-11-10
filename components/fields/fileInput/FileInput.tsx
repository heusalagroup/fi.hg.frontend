// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { ReactNode, useState } from 'react';
import { FileInputFieldModel } from "../../../types/items/FileInputModel";
import { FormFieldState, stringifyFormFieldState } from "../../../types/FormFieldState";
import { ThemeService } from "../../../services/ThemeService";
import { stringifyStyleScheme, StyleScheme } from "../../../types/StyleScheme";
import { FILE_INPUT_FIELD_CLASS_NAME, FIELD_CLASS_NAME } from "../../../constants/hgClassName";
import { FieldChangeCallback } from "../../../hooks/field/useFieldChangeCallback";
import './FileInput.scss';
import { LogService } from "../../../../core/LogService";
import { useFileInputField } from "../../../hooks/field/useFileInputField";

const LOG = LogService.createLogger('FileInput');


const COMPONENT_CLASS_NAME = FILE_INPUT_FIELD_CLASS_NAME;
const COMPONENT_INPUT_TYPE = "file";

export interface FileInputFieldProps {
    readonly className?: string;
    readonly style?: StyleScheme;
    readonly label?: string;
    readonly placeholder?: string;
    readonly model?: FileInputFieldModel;
    readonly value?: string;
    readonly change?: FieldChangeCallback<string | undefined>;
    readonly changeState?: FieldChangeCallback<FormFieldState>;
    readonly children?: ReactNode;
}

export function FileInput(props: FileInputFieldProps) {
    const className = props?.className;
    const styleScheme = props?.style ?? ThemeService.getStyleScheme();
    const placeholder = props.placeholder ?? props.model?.placeholder;
    const label = props.label ?? props.model?.label ?? '';

    const {
        fieldState,
        value,
        onChangeCallback
    } = useFileInputField(
        label,
        props?.model?.key ?? '',
        props?.change,
        props?.changeState,
        props?.value,
    )


    LOG.debug('Currently Selected Files =', value)

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
                    COMPONENT_CLASS_NAME + '-label'
                    + ` ${FIELD_CLASS_NAME}-label`
                }>{label}</span>
            ) : null}
            <input
                className={
                    COMPONENT_CLASS_NAME + '-input'
                    + ` ${FIELD_CLASS_NAME}-input`
                }
                type={COMPONENT_INPUT_TYPE}
                autoComplete="off"
                placeholder={placeholder}
                onChange={onChangeCallback}
                readOnly={props?.change === undefined}
            />
            {value}
            {props?.children}
        </label>
    );

}

