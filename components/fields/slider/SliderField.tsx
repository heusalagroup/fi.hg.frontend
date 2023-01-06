// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2020-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { SelectFieldModel, SelectFieldItem} from "../../../types/items/SelectFieldModel";
import { map } from "../../../../core/functions/map";
import { FormFieldState,  stringifyFormFieldState } from "../../../types/FormFieldState";
import { ThemeService } from "../../../services/ThemeService";
import { stringifyStyleScheme, StyleScheme } from "../../../types/StyleScheme";
import { FIELD_CLASS_NAME, SLIDER_FIELD_CLASS_NAME } from "../../../constants/hgClassName";
import { FieldChangeCallback } from "../../../hooks/field/useFieldChangeCallback";
import { useSliderField } from "../../../hooks/field/useSliderField";
import './SliderField.scss';

const COMPONENT_CLASS_NAME = SLIDER_FIELD_CLASS_NAME;

export interface SliderFieldProps<T> {
    readonly className   ?: string;
    readonly style       ?: StyleScheme;
    readonly label       ?: string;
    readonly placeholder ?: string;
    readonly model       ?: SelectFieldModel<T>;
    readonly value       ?: T;
    readonly change      ?: FieldChangeCallback<T | undefined>;
    readonly changeState ?: FieldChangeCallback<FormFieldState>;
    readonly values       : SelectFieldItem<T>[];
    readonly name        ?: string;
}

export function SliderField (props: SliderFieldProps<any>) {

    const className = props?.className;
    const styleScheme = props?.style ?? ThemeService.getStyleScheme();
    const label = props.label ?? props.model?.label ?? '';
    const selectItems = props?.values ?? props?.model?.values;

    const {
        id,
        name,
        fieldState,
        selectedItem,
        onChangeCallback
    } = useSliderField<any>(
        label,
        props?.model?.key ?? '',
        props?.change,
        props?.changeState,
        props?.name,
        props?.value,
        selectItems,
        props?.model?.required ?? false
    );

    return (
        <div className={
            COMPONENT_CLASS_NAME
            + ' ' + FIELD_CLASS_NAME
            + ` ${FIELD_CLASS_NAME}-style-${stringifyStyleScheme(styleScheme)}`
            + ` ${FIELD_CLASS_NAME}-state-${stringifyFormFieldState(fieldState)}`
            + (className? ` ${className}` : '')
        }>

            {label ? (
                <label className={
                    COMPONENT_CLASS_NAME+'-label'
                    + ` ${FIELD_CLASS_NAME}-label`
                }>{label}</label>
            ) : null}

            <div className={
                COMPONENT_CLASS_NAME + '-options'
                + ` ${FIELD_CLASS_NAME}-options`
            }>
                {map(selectItems, (item : SelectFieldItem<any>, itemIndex: number) => {

                    const itemLabel    : string  = item?.label ?? '';
                    const itemValue    : any     = item?.value ?? undefined;
                    const itemSelected : boolean = selectedItem ? itemValue === selectedItem?.value : false;

                    const itemProps : {checked?: boolean} = {};
                    if (itemSelected) {
                        itemProps.checked = true;
                    }

                    return (
                        <label
                            key={`slider-${id}-label-${itemIndex}`}
                            className={
                                COMPONENT_CLASS_NAME + '-option'
                                + ` ${FIELD_CLASS_NAME}-option`
                            }
                        >

                            <div className={
                                COMPONENT_CLASS_NAME + '-option-input'
                                + ` ${FIELD_CLASS_NAME}-option-input`
                            }>
                                <div className={
                                    COMPONENT_CLASS_NAME + '-option-input-fill '
                                    + ` ${FIELD_CLASS_NAME}-option-input-fill`
                                    + ' ' + COMPONENT_CLASS_NAME + '-option-input-fill-with-'
                                    + (itemIndex !== 0 ? 'line' : 'no-line')
                                } />
                                <input
                                    className={
                                        COMPONENT_CLASS_NAME+'-option-input-element'
                                        + ` ${FIELD_CLASS_NAME}-option-input-element`
                                    }
                                    type="radio"
                                    name={name}
                                    value={`${itemIndex}`}
                                    onChange={onChangeCallback}
                                    autoComplete="off"
                                    {...itemProps}
                                />
                                <div className={
                                    COMPONENT_CLASS_NAME + '-option-input-fill '
                                    + ` ${FIELD_CLASS_NAME}-option-input-fill`
                                    + ' ' + COMPONENT_CLASS_NAME + '-option-input-fill-with-'
                                    + (itemIndex !== selectItems.length - 1 ? 'line' : 'no-line')
                                } />
                            </div>

                            <div className={
                                COMPONENT_CLASS_NAME + '-option-label'
                                + ` ${FIELD_CLASS_NAME}-option-label`
                            }>
                                {itemLabel ? (
                                    <span className={
                                        COMPONENT_CLASS_NAME+'-option-label-text'
                                        + ` ${FIELD_CLASS_NAME}-option-label-text`
                                    }>{itemLabel}</span>
                                ) : null}
                            </div>

                        </label>
                    );
                })}
            </div>

        </div>
    );

}

