// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { FormItemType } from "../FormItemType";
import { FormFieldModel,  isFormFieldModel } from "../FormFieldModel";

export interface FileInputFieldModel extends FormFieldModel {
    readonly type         : FormItemType.FILE_FIELD;
}

export function isFieldInputFieldModel (value: any) : value is FileInputFieldModel {
    return value?.type === FormItemType.FILE_FIELD && isFormFieldModel(value);
}

export function stringifyDatepickerFieldModel (value: FileInputFieldModel): string {
    if ( !isFieldInputFieldModel(value) ) throw new TypeError(`Not fieldInputFieldModel: ${value}`);
    return `FieldInputFieldModel(${value})`;
}

export function parseDatepickerFieldModel (value: any): FileInputFieldModel | undefined {
    if ( isFieldInputFieldModel(value) ) return value;
    return undefined;
}


