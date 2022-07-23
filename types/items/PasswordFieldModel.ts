// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { FormItemType } from "../FormItemType";
import { FormFieldModel,  isFormFieldModel } from "../FormFieldModel";

export interface PasswordFieldModel extends FormFieldModel {

    readonly type         : FormItemType.PASSWORD_FIELD;
    readonly minLength   ?: number;
    readonly maxLength   ?: number;

}

export function isPasswordFieldModel (value: any) : value is PasswordFieldModel {
    return value?.type === FormItemType.PASSWORD_FIELD && isFormFieldModel(value);
}

export function stringifyPasswordFieldModel (value: PasswordFieldModel): string {
    if ( !isPasswordFieldModel(value) ) throw new TypeError(`Not PasswordFieldModel: ${value}`);
    return `PasswordFieldModel(${value})`;
}

export function parsePasswordFieldModel (value: any): PasswordFieldModel | undefined {
    if ( isPasswordFieldModel(value) ) return value;
    return undefined;
}


