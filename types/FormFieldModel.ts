// Copyright (c) 2020-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { FormItemModel } from "./FormItemModel";
import { FormFieldType, isFormFieldType } from "./FormFieldType";
import { isStyleScheme, StyleScheme } from "./StyleScheme";
import { isUndefined } from "../../core/types/undefined";
import { isBooleanOrUndefined } from "../../core/types/Boolean";
import { isStringOrUndefined } from "../../core/types/String";
import { isNumberOrUndefined } from "../../core/types/Number";

export interface FormFieldModel extends FormItemModel {

    readonly type        : FormFieldType;
    readonly key         ?: string;
    readonly style       ?: StyleScheme;
    readonly label       ?: string;
    readonly placeholder ?: string;
    readonly required    ?: boolean;
    readonly minValue    ?: any;
    readonly maxValue    ?: any;
    readonly minLength   ?: number;
    readonly maxLength   ?: number;

}

export function isFormFieldModel (value: any) : value is FormFieldModel {
    return (
        !!value
        && isFormFieldType(value?.type)
        && isStringOrUndefined(value?.key)
        && ( isUndefined(value?.style) || isStyleScheme(value?.style) )
        && isStringOrUndefined(value?.label)
        && isStringOrUndefined(value?.placeholder)
        && isBooleanOrUndefined(value?.required)
        && isNumberOrUndefined(value?.minLength)
        && isNumberOrUndefined(value?.maxLength)
    );
}

export function stringifyFormFieldModel (value: FormFieldModel): string {
    if ( !isFormFieldModel(value) ) throw new TypeError(`Not FormFieldModel: ${value}`);
    return `FormFieldModel(${value})`;
}

export function parseFormFieldModel (value: any): FormFieldModel | undefined {
    if ( isFormFieldModel(value) ) return value;
    return undefined;
}


