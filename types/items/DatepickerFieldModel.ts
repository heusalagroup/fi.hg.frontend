// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { FormItemType } from "../FormItemType";
import { FormFieldModel,  isFormFieldModel } from "../FormFieldModel";

export interface DatePickerFieldModel extends FormFieldModel {
    readonly type         : FormItemType.DATE_FIELD;
}

export function isDatepickerFieldModel (value: any) : value is DatePickerFieldModel {
    return value?.type === FormItemType.DATE_FIELD && isFormFieldModel(value);
}

export function stringifyDatepickerFieldModel (value: DatePickerFieldModel): string {
    if ( !isDatepickerFieldModel(value) ) throw new TypeError(`Not DatepickerFieldModel: ${value}`);
    return `DatepickerFieldModel(${value})`;
}

export function parseDatepickerFieldModel (value: any): DatePickerFieldModel | undefined {
    if ( isDatepickerFieldModel(value) ) return value;
    return undefined;
}


