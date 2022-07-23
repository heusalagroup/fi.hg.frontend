// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { FormItemType } from "../FormItemType";
import { FormFieldModel,  isFormFieldModel } from "../FormFieldModel";

export interface TextAreaFieldModel extends FormFieldModel {
    readonly type         : FormItemType.TEXT_AREA_FIELD;
    readonly minLength   ?: number;
    readonly maxLength   ?: number;
}

export function isTextAreaFieldModel (value: any) : value is TextAreaFieldModel {
    return value?.type === FormItemType.TEXT_AREA_FIELD && isFormFieldModel(value);
}

export function stringifyTextAreaFieldModel (value: TextAreaFieldModel): string {
    if ( !isTextAreaFieldModel(value) ) throw new TypeError(`Not TextAreaFieldModel: ${value}`);
    return `TextAreaFieldModel(${value})`;
}

export function parseTextAreaFieldModel (value: any): TextAreaFieldModel | undefined {
    if ( isTextAreaFieldModel(value) ) return value;
    return undefined;
}


