// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { FormItemType } from "../FormItemType";
import { FormFieldModel,  isFormFieldModel } from "../FormFieldModel";
import { isNumberOrUndefined } from "../../../core/types/Number";

export interface IntegerFieldModel extends FormFieldModel {

    readonly type      : FormItemType.INTEGER_FIELD;
    readonly minValue ?: number;
    readonly maxValue ?: number;

}

export function isIntegerFieldModel (value: any) : value is IntegerFieldModel {
    return (
        value?.type === FormItemType.INTEGER_FIELD
        && isNumberOrUndefined(value?.minValue)
        && isNumberOrUndefined(value?.maxValue)
        && isFormFieldModel(value)
    );
}

export function stringifyIntegerFieldModel (value: IntegerFieldModel): string {
    if ( !isIntegerFieldModel(value) ) throw new TypeError(`Not IntegerFieldModel: ${value}`);
    return `IntegerFieldModel(${value})`;
}

export function parseIntegerFieldModel (value: any): IntegerFieldModel | undefined {
    if ( isIntegerFieldModel(value) ) return value;
    return undefined;
}


