// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    useState,
    MouseEvent,
    ChangeEvent,
    ReactNode,
    useCallback,
    useRef,
    useEffect
} from 'react';
import { CheckboxFieldModel } from "../../../types/items/CheckboxFieldModel";
import { FormFieldState, stringifyFormFieldState } from "../../../types/FormFieldState";
import { LogService } from "../../../../core/LogService";
import { ThemeService } from "../../../services/ThemeService";
import { stringifyStyleScheme, StyleScheme } from "../../../types/StyleScheme";
import {
    CHECKBOX_FIELD_CLASS_NAME,
    FIELD_CLASS_NAME
} from "../../../constants/hgClassName";
import './CheckboxField.scss';
import { useFieldChangeState } from "../../../hooks/field/useFieldChangeState";
import { FieldChangeCallback } from "../../../hooks/field/useFieldChangeCallback";

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

    const className = props?.className;
    const label = props.label ?? props.model?.label ?? '';
    const change = props?.change;
    const changeState = props?.changeState;
    const styleScheme = props?.style ?? ThemeService.getStyleScheme();
    const key = props?.model?.key ?? '';
    const identifier = `#${key}: "${label}"`;

    const [ fieldState, setFieldState ] = useState<FormFieldState>(FormFieldState.CONSTRUCTED);
    const [ value, setValue ] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const validateValueCallback = useCallback(
        (
            internalValue: boolean | undefined,
            required: boolean
        ): boolean => {
            LOG.debug(`${identifier}: validateValueCallback: `, required, internalValue);
            return required ? internalValue === true : true;
        },
        [
            identifier
        ]
    );

    const validateWithStateValueCallback = useCallback(
        (
            stateValue: boolean,
            propValue: boolean | undefined,
            required: boolean
        ): boolean => {

            LOG.debug(`${identifier}: _validateWithStateValue: stateValue = `, stateValue);

            if ( !validateValueCallback(propValue, required) ) {
                LOG.debug(`${identifier}: _validateWithStateValue: propValue = `, propValue);
                return false;
            }

            if ( !validateValueCallback(stateValue, required) ) {
                return false;
            }

            LOG.debug(`${identifier}: _validateWithStateValue: propValue = `, propValue);
            return stateValue === (propValue ?? false);

        },
        [
            identifier,
            validateValueCallback
        ]
    );

    const updateFieldStateCallback = useCallback(
        () => {

            LOG.debug(`${identifier}: updateFieldStateCallback: state: `, stringifyFormFieldState(fieldState));

            if ( fieldState < FormFieldState.MOUNTED ) return;
            if ( fieldState >= FormFieldState.UNMOUNTED ) return;

            const isValid = validateWithStateValueCallback(
                value,
                props.value,
                props?.model?.required ?? false
            );
            LOG.debug(`${identifier}: updateFieldStateCallback: isValid: `, isValid);

            setFieldState(isValid ? FormFieldState.VALID : FormFieldState.INVALID);

        },
        [
            value,
            identifier,
            fieldState,
            validateWithStateValueCallback,
            props.value,
            props?.model?.required
        ]
    );

    const setStateValue = useCallback(
        (newValue: boolean) => {
            if ( newValue !== value ) {
                setValue(newValue);
                updateFieldStateCallback();
            }
        },
        [
            value,
            updateFieldStateCallback
        ]
    );

    const toggleCallback = useCallback(
        (event: MouseEvent<HTMLLabelElement>) => {
            if ( event ) {
                event.preventDefault();
                event.stopPropagation();
            }
            setValue((oldValue) => !oldValue);
        }, [
            setValue
        ]
    );

    const updateValueStateCallback = useCallback(
        () => {
            setStateValue(props?.value ?? false);
        },
        [
            setStateValue,
            props?.value
        ]
    );

    const onChangeCallback = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            if ( event ) {
                event.preventDefault();
                event.stopPropagation();
            }
            const newValue: boolean = event?.target?.checked ?? false;
            LOG.debug(`${identifier}: _onChange: newValue = `, newValue);
            setValue(newValue);
        },
        [
            identifier,
            setValue
        ]
    );

    // Call update methods and set initial state initially and when unmounted
    useEffect(
        () => {
            LOG.debug('Mount');
            updateValueStateCallback();
            setFieldState(FormFieldState.MOUNTED);
            updateFieldStateCallback();
            return () => {
                LOG.debug('Unmount');
                setFieldState(FormFieldState.UNMOUNTED);
            };
        },
        [
            updateValueStateCallback,
            updateFieldStateCallback
        ]
    );

    // Update field state and internal value when props?.value changes
    useEffect(
        () => {
            const newValue = props?.value ?? false;
            LOG.debug(`${identifier}: Update: `, newValue);
            updateFieldStateCallback();
            if ( value !== newValue ) {
                setValue(() => props?.value ?? false);
            }
        },
        [
            props?.value,
            identifier,
            updateFieldStateCallback,
            setValue,
            value
        ]
    );

    // Call props.change when internal value changes
    useEffect(
        () => {
            LOG.debug(`${identifier}: Props value changed: `, value);
            if ( change ) {
                try {
                    change(value);
                } catch (err) {
                    LOG.error(`${identifier}: Error in change props: `, err);
                }
            } else {
                LOG.warn(`${identifier}: No change props defined!`);
            }
        },
        [
            identifier,
            value,
            change
        ]
    );

    // Call updateFieldStateCallback() when internal value changes
    useEffect(
        () => {
            LOG.debug(`Internal value update: `, value);
            updateFieldStateCallback();
        },
        [
            value,
            updateFieldStateCallback
        ]
    );

    useFieldChangeState(changeState, fieldState);

    return (
        <label
            className={
                `${COMPONENT_CLASS_NAME} ${FIELD_CLASS_NAME}`
                + ` ${FIELD_CLASS_NAME}-style-${stringifyStyleScheme(styleScheme)}`
                + ` ${FIELD_CLASS_NAME}-state-${fieldState}`
                + ` ${className ? ` ${className}` : ''}`
            }
            onClick={toggleCallback}
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
