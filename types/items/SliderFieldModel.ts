// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { FormItemType } from "../FormItemType";
import { FormFieldModel,  isFormFieldModel } from "../FormFieldModel";
import { SelectFieldItem } from "./SelectFieldModel";
import { TestCallback } from "../../../core/types/TestCallback";
import { isArrayOf } from "../../../core/types/Array";

export interface SliderFieldModel<T> extends FormFieldModel {

    readonly type   : FormItemType.SLIDER_FIELD;
    readonly values : SelectFieldItem<T>[];

}

export function isSliderFieldModel<T = any> (
    value  : any,
    isItem : TestCallback | undefined = undefined
) : value is SliderFieldModel<T> {
    return (
        value?.type === FormItemType.SLIDER_FIELD
        && isArrayOf<T>(value?.values, isItem)
        && isFormFieldModel(value)
    );
}

export function stringifySliderFieldModel<T = any> (value: SliderFieldModel<T>): string {
    if ( !isSliderFieldModel(value) ) throw new TypeError(`Not SliderFieldModel: ${value}`);
    return `SliderFieldModel(${value})`;
}

/**
 *
 * @param value
 * @fixme No support to parse value items
 */
export function parseSliderFieldModel<T = any> (value: any): SliderFieldModel<T> | undefined {
    if ( isSliderFieldModel<T>(value) ) return value;
    return undefined;
}


