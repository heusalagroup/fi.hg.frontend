// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { FormItemType } from "../FormItemType";
import { FormFieldModel,  isFormFieldModel } from "../FormFieldModel";

export interface CheckboxFieldModel extends FormFieldModel {
    readonly type         : FormItemType.CHECKBOX_FIELD;
}

export function isCheckboxFieldModel (value: any) : value is CheckboxFieldModel {
    return value?.type === FormItemType.CHECKBOX_FIELD && isFormFieldModel(value);
}

export function stringifyCheckboxFieldModel (value: CheckboxFieldModel): string {
    if ( !isCheckboxFieldModel(value) ) throw new TypeError(`Not CheckboxFieldModel: ${value}`);
    return `CheckboxFieldModel(${value})`;
}

export function parseCheckboxFieldModel (value: any): CheckboxFieldModel | undefined {
    if ( isCheckboxFieldModel(value) ) return value;
    return undefined;
}


