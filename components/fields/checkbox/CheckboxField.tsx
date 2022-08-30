// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    ChangeEvent,
    ReactNode,
    useCallback,
    useRef
} from 'react';
import { CheckboxFieldModel } from "../../../types/items/CheckboxFieldModel";
import { FormFieldState } from "../../../types/FormFieldState";
import { LogService } from "../../../../core/LogService";
import { ThemeService } from "../../../services/ThemeService";
import { stringifyStyleScheme, StyleScheme } from "../../../types/StyleScheme";
import {
    CHECKBOX_FIELD_CLASS_NAME,
    FIELD_CLASS_NAME
} from "../../../constants/hgClassName";
import { FieldChangeCallback } from "../../../hooks/field/useFieldChangeCallback";
import './CheckboxField.scss';

const LOG = LogService.createLogger('CheckboxField');
const COMPONENT_CLASS_NAME = CHECKBOX_FIELD_CLASS_NAME;
const COMPONENT_INPUT_TYPE = "checkbox";

export interface CheckboxFieldProps {
    readonly className?: string;
    readonly style?: StyleScheme;
    readonly label?: string;
    readonly placeholder?: string;
    readonly model?: CheckboxFieldModel;
    readonly value?: boolean;
    readonly change?: FieldChangeCallback<boolean | undefined>;
    readonly changeState?: FieldChangeCallback<FormFieldState>;
    readonly children?: ReactNode;
}

export function CheckboxField (props: CheckboxFieldProps) {

    const value = !!props?.value;
    const className = props?.className;
    const label = props.label ?? props.model?.label ?? '';
    const change = props?.change;
    const styleScheme = props?.style ?? ThemeService.getStyleScheme();
    const key = props?.model?.key ?? '';
    const identifier = `#${key}: "${label}"`;
    const inputRef = useRef<HTMLInputElement>(null);

    const changeCallback = useCallback(
        (value: boolean | undefined) => {
            if ( change ) {
                try {
                    change(!!value);
                } catch (err) {
                    LOG.error(`${identifier}: Error in change props: `, err);
                }
            } else {
                LOG.warn(`${identifier}: No change props defined!`);
            }
        },
        [
            identifier,
            change
        ]
    );

    const onChangeCallback = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const newValue = !!event?.target?.checked;
            LOG.debug(`${identifier}: _onChange: Change detected: `, newValue);
            changeCallback(newValue);
        },
        [
            identifier,
            changeCallback
        ]
    );

    return (
        <label
            className={
                `${COMPONENT_CLASS_NAME} ${FIELD_CLASS_NAME}`
                + ` ${FIELD_CLASS_NAME}-style-${stringifyStyleScheme(styleScheme)}`
                // + ` ${FIELD_CLASS_NAME}-state-${stringifyFormFieldState(fieldState)}`
                + ` ${className ? ` ${className}` : ''}`
            }
        >
            <input
                ref={inputRef}
                className={
                    COMPONENT_CLASS_NAME + '-input'
                    + ` ${FIELD_CLASS_NAME}-input`
                }
                type={COMPONENT_INPUT_TYPE}
                autoComplete="off"
                checked={value}
                onChange={onChangeCallback}
                readOnly={props?.change === undefined}
            />
            {label ? (
                <span
                    className={
                        COMPONENT_CLASS_NAME + '-label'
                        + ` ${FIELD_CLASS_NAME}-label`
                    }
                >{label}</span>
            ) : null}
            {props.children}
        </label>
    );

}
