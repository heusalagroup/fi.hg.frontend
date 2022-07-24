// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2020-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    createRef,
    ReactNode
} from 'react';
import { SelectFieldModel, SelectFieldItem} from "../../../types/items/SelectFieldModel";
import {
    map
} from "../../../../core/modules/lodash";
import { Popup } from "../../popup/Popup";
import { Button } from "../../button/Button";
import { FormFieldState, stringifyFormFieldState } from "../../../types/FormFieldState";
import { ThemeService } from "../../../services/ThemeService";
import { stringifyStyleScheme, StyleScheme } from "../../../types/StyleScheme";
import {
    FIELD_CLASS_NAME,
    SELECT_FIELD_CLASS_NAME
} from "../../../constants/hgClassName";
import { useSelectField } from "../../../hooks/field/useSelectField";
import { FieldChangeCallback } from "../../../hooks/field/useFieldChangeCallback";
import './SelectField.scss';

const COMPONENT_CLASS_NAME = SELECT_FIELD_CLASS_NAME;
const CLOSE_DROPDOWN_TIMEOUT_ON_BLUR = 100;
const MOVE_TO_ITEM_ON_OPEN_DROPDOWN_TIMEOUT = 100;

export interface SelectFieldProps<T> {
    readonly className   ?: string;
    readonly style       ?: StyleScheme;
    readonly label       ?: string;
    readonly placeholder ?: string;
    readonly model       ?: SelectFieldModel<T>;
    readonly value       ?: T;
    readonly change      ?: FieldChangeCallback<T | undefined>;
    readonly changeState ?: FieldChangeCallback<FormFieldState>;
    readonly values       : readonly SelectFieldItem<T>[];
    readonly children    ?: ReactNode;
}

export function SelectField (props: SelectFieldProps<any>) {

    const className = props?.className;
    const styleScheme = props?.style ?? ThemeService.getStyleScheme();
    const placeholder = props.placeholder ?? props.model?.placeholder;
    const label = props.label ?? props.model?.label ?? '';

    const selectItems = props?.values ?? props?.model?.values ?? [];

    const {
        fieldState,
        inputRef,
        currentItemLabel,
        currentItemIndex,
        selectItemCallback,
        onFocusCallback,
        onBlurCallback,
        onChangeCallback,
        onKeyDownCallback,
        dropdownOpen,
        buttonRefs
    } = useSelectField<any>(
        label,
        props?.model?.key ?? '',
        props?.change,
        props?.changeState,
        props?.value,
        selectItems,
        props?.model?.required ?? false,
        CLOSE_DROPDOWN_TIMEOUT_ON_BLUR,
        MOVE_TO_ITEM_ON_OPEN_DROPDOWN_TIMEOUT
    );

    return (
        <div
            className={
                `${COMPONENT_CLASS_NAME} ${FIELD_CLASS_NAME}`
                + ` ${FIELD_CLASS_NAME}-style-${stringifyStyleScheme(styleScheme)}`
                + ` ${FIELD_CLASS_NAME}-state-${stringifyFormFieldState(fieldState)}`
                + ` ${className ? ` ${className}` : ''}`
            }
        >
            <label className={
                COMPONENT_CLASS_NAME + '-label'
                + ` ${FIELD_CLASS_NAME}-label`
            }>

                {label ? (
                    <span className={COMPONENT_CLASS_NAME+'-label-text'}>{label}</span>
                ) : null}

                <input
                    ref={inputRef}
                    className={
                        COMPONENT_CLASS_NAME+'-input'
                        + ` ${FIELD_CLASS_NAME}-input`
                    }
                    type="text"
                    autoComplete="off"
                    placeholder={placeholder}
                    value={currentItemLabel}
                    onFocus={onFocusCallback}
                    onBlur={onBlurCallback}
                    onChange={onChangeCallback}
                    onKeyDown={onKeyDownCallback}
                />

                {props?.children}

            </label>

            <Popup open={dropdownOpen}>
                <div className={COMPONENT_CLASS_NAME + '-dropdown'}>
                    {map(selectItems, (selectItem : SelectFieldItem<any>, itemIndex: number) : any => {

                        const isCurrentButton = currentItemIndex !== undefined && itemIndex === currentItemIndex;

                        const itemClickCallback = () => selectItemCallback(itemIndex);

                        if (itemIndex >= buttonRefs.length) {
                            buttonRefs[itemIndex] = createRef<HTMLButtonElement>();
                        }

                        const itemButtonRef = buttonRefs[itemIndex];

                        return (
                            <Button
                                key={`dropdown-item-${itemIndex}-value-${selectItem.value}`}
                                buttonRef={itemButtonRef}
                                className={
                                    COMPONENT_CLASS_NAME + '-dropdown-item'
                                    + ' ' + (isCurrentButton ? COMPONENT_CLASS_NAME + '-dropdown-item-current' : '')
                                }
                                focus={onFocusCallback}
                                blur={onBlurCallback}
                                click={itemClickCallback}
                                keyDown={onKeyDownCallback}
                            >{selectItem?.label ?? ''}</Button>
                        );

                    })}
                </div>
            </Popup>

        </div>
    );

}
