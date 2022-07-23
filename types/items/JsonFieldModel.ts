// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { FormItemType } from "../FormItemType";
import { FormFieldModel,  isFormFieldModel } from "../FormFieldModel";

export interface JsonFieldModel extends FormFieldModel {
    readonly type         : FormItemType.JSON_FIELD;
    readonly minLength   ?: number;
    readonly maxLength   ?: number;
}

export function isJsonFieldModel (value: any) : value is JsonFieldModel {
    return value?.type === FormItemType.JSON_FIELD && isFormFieldModel(value);
}

export function stringifyJsonFieldModel (value: JsonFieldModel): string {
    if ( !isJsonFieldModel(value) ) throw new TypeError(`Not JsonFieldModel: ${value}`);
    return `JsonFieldModel(${value})`;
}

export function parseJsonFieldModel (value: any): JsonFieldModel | undefined {
    if ( isJsonFieldModel(value) ) return value;
    return undefined;
}


