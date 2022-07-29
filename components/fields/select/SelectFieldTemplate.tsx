// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2020-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    createRef,
    ReactNode,
    RefObject
} from 'react';
import { SelectFieldModel, SelectFieldItem } from "../../../types/items/SelectFieldModel";
import {
    map
} from "../../../../core/modules/lodash";
import { Popup } from "../../popup/Popup";
import { Button } from "../../button/Button";
import { FormFieldState, stringifyFormFieldState } from "../../../types/FormFieldState";
import { ThemeService } from "../../../services/ThemeService";
import { stringifyStyleScheme, StyleScheme } from "../../../types/StyleScheme";
import {
    SELECT_FIELD_TEMPLATE_CLASS_NAME
} from "../../../constants/hgClassName";
import { FieldChangeCallback } from "../../../hooks/field/useFieldChangeCallback";
import { VoidCallback } from '../../../../core/interfaces/callbacks';
import { LogService } from "../../../../core/LogService";
import { SelectItemCallback } from '../../../hooks/field/array/useSelectItemCallback';
import './SelectFieldTemplate.scss';

const LOG = LogService.createLogger('SelectFieldTemplate');

const COMPONENT_CLASS_NAME = SELECT_FIELD_TEMPLATE_CLASS_NAME;

export interface SelectFieldTemplateProps<T> {
    readonly className?: string;
    readonly style?: StyleScheme;
    readonly label?: string;
    readonly placeholder?: string;
    readonly model?: SelectFieldModel<T>;
    readonly value?: T;
    readonly change?: FieldChangeCallback<T>;
    readonly changeState?: FieldChangeCallback<FormFieldState>;
    readonly values: readonly SelectFieldItem<T>[];
    readonly children?: ReactNode;
    readonly inputRef?: RefObject<HTMLInputElement>;
    readonly buttonRefs?: RefObject<HTMLButtonElement>[];
    readonly onFocusCallback?: VoidCallback;
    readonly onBlurCallback?: VoidCallback;
    readonly onChangeCallback?: FieldChangeCallback<T>;
    readonly onKeyDownCallback?: FieldChangeCallback<T>;
    readonly dropdownOpen?: boolean;
    readonly fieldState: FormFieldState;
    readonly currentItemLabel?: string;
    readonly currentItemIndex?: number | undefined;
    readonly selectItemCallback: SelectItemCallback;

}

export function SelectFieldTemplate(props: SelectFieldTemplateProps<any>) {

    const className = props?.className;

    const styleScheme = props?.style ?? ThemeService.getStyleScheme();
    const placeholder = props.placeholder ?? props.model?.placeholder;
    const label = props.label ?? props.model?.label ?? '';
    const inputRef = props.inputRef;
    const buttonRefs = props.buttonRefs ? props.buttonRefs : [];
    const onFocusCallback = props.onFocusCallback;
    const onBlurCallback = props.onBlurCallback;
    const onChangeCallback = props.onChangeCallback;
    const onKeyDownCallback = props.onKeyDownCallback;
    const currentItemLabel = props.currentItemLabel;
    const currentItemIndex = props.currentItemIndex;
    const dropdownOpen = props.dropdownOpen ? props.dropdownOpen : false;
    const selectItemCallback = props.selectItemCallback;
    const selectItems = props?.values ?? props?.model?.values ?? [];
    const fieldState = props.fieldState;

    return (
        <div
            className={
                `${COMPONENT_CLASS_NAME} ${SELECT_FIELD_TEMPLATE_CLASS_NAME}`
                + ` ${SELECT_FIELD_TEMPLATE_CLASS_NAME}-style-${stringifyStyleScheme(styleScheme)}`
                + ` ${SELECT_FIELD_TEMPLATE_CLASS_NAME}-state-${stringifyFormFieldState(fieldState)}`
                + ` ${className ? ` ${className}` : ''}`
            }
        >
            <label className={
                COMPONENT_CLASS_NAME + '-label'
                + ` ${SELECT_FIELD_TEMPLATE_CLASS_NAME}-label`
            }>

                {label ? (
                    <span className={COMPONENT_CLASS_NAME + '-label-text'}>{label}</span>
                ) : null}

                <input
                    ref={inputRef}
                    className={
                        COMPONENT_CLASS_NAME + '-input'
                        + ` ${SELECT_FIELD_TEMPLATE_CLASS_NAME}-input`
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
                    {map(selectItems, (selectItem: SelectFieldItem<any>, itemIndex: number): any => {

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
