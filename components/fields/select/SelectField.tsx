// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2020-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    ReactNode
} from 'react';
import { SelectFieldModel, SelectFieldItem} from "../../../types/items/SelectFieldModel";
import { FormFieldState } from "../../../types/FormFieldState";
import { ThemeService } from "../../../services/ThemeService";
import { StyleScheme } from "../../../types/StyleScheme";
import {
    SELECT_FIELD_CLASS_NAME
} from "../../../constants/hgClassName";
import { useSelectField } from "../../../hooks/field/useSelectField";
import { FieldChangeCallback } from "../../../hooks/field/useFieldChangeCallback";
import { SelectTemplate } from './SelectTemplate';
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
        <SelectTemplate
            className={
                COMPONENT_CLASS_NAME
                + (className ? ` ${className}` : '')
            }
            style={styleScheme}
            placeholder={placeholder}
            values={selectItems}
            fieldState={fieldState}
            inputRef={inputRef}
            label={label}
            currentItemLabel={currentItemLabel}
            currentItemIndex={currentItemIndex}
            selectItemCallback={selectItemCallback}
            onFocusCallback={onFocusCallback}
            onBlurCallback={onBlurCallback}
            onChangeCallback={onChangeCallback}
            onKeyDownCallback={onKeyDownCallback}
            dropdownOpen={dropdownOpen}
            buttonRefs={buttonRefs}
        />
    );

}
