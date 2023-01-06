// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { FormItem, isFormItem} from "./FormItem";
import { isString, isStringOrUndefined } from "../../core/types/String";
import { isArrayOf } from "../../core/types/Array";

export interface FormModel {

    readonly title        : string;
    readonly cancelLabel ?: string;
    readonly submitLabel ?: string;
    readonly items        : FormItem[];

}

export function isFormModel (value : any) : value is FormModel {

    return (
        !!value
        && isString(value?.title)
        && isStringOrUndefined(value?.cancelLabel)
        && isStringOrUndefined(value?.submitLabel)
        && isArrayOf<FormItem>(value?.items, isFormItem)
    );

}

export function stringifyFormModel (value: FormModel): string {
    if ( !isFormModel(value) ) throw new TypeError(`Not FormModel: ${value}`);
    return `FormModel(${value})`;
}

export function parseFormModel (value: any): FormModel | undefined {
    if ( isFormModel(value) ) return value;
    return undefined;
}


