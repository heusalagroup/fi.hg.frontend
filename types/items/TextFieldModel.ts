// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { FormItemType } from "../FormItemType";
import { FormFieldModel,  isFormFieldModel } from "../FormFieldModel";

export interface TextFieldModel extends FormFieldModel {
    readonly type         : FormItemType.TEXT_FIELD;
    readonly minLength   ?: number;
    readonly maxLength   ?: number;
}

export function isTextFieldModel (value: any) : value is TextFieldModel {
    return value?.type === FormItemType.TEXT_FIELD && isFormFieldModel(value);
}

export function stringifyTextFieldModel (value: TextFieldModel): string {
    if ( !isTextFieldModel(value) ) throw new TypeError(`Not TextFieldModel: ${value}`);
    return `TextFieldModel(${value})`;
}

export function parseTextFieldModel (value: any): TextFieldModel | undefined {
    if ( isTextFieldModel(value) ) return value;
    return undefined;
}


