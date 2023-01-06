// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { FormItemType } from "../FormItemType";
import {
    FormFieldModel,
    isFormFieldModel
} from "../FormFieldModel";
import { TestCallback } from "../../../core/types/TestCallback";
import { isArrayOf } from "../../../core/types/Array";

export interface SelectFieldItem<T> {
    readonly label : string;
    readonly value : T;
}

export function createSelectFieldItem<T>(
    label: string,
    value: T
) : SelectFieldItem<T> {
    return {
        label,
        value
    }
}

export interface SelectFieldModel<T> extends FormFieldModel {
    readonly type   : FormItemType.SELECT_FIELD;
    readonly values : SelectFieldItem<T>[];
}

export function isSelectFieldModel<T = any> (
    value  : any,
    isItem : TestCallback | undefined = undefined
) : value is SelectFieldModel<T> {
    return (
        value?.type === FormItemType.SELECT_FIELD
        && isArrayOf<T>(value?.values, isItem)
        && isFormFieldModel(value)
    );
}

export function stringifySelectFieldModel<T = any> (value: SelectFieldModel<T>): string {
    if ( !isSelectFieldModel(value) ) throw new TypeError(`Not SelectFieldModel: ${value}`);
    return `SelectFieldModel(${value})`;
}

/**
 *
 * @param value
 * @fixme No support to parse value items
 */
export function parseSelectFieldModel<T = any> (value: any): SelectFieldModel<T> | undefined {
    if ( isSelectFieldModel<T>(value) ) return value;
    return undefined;
}


