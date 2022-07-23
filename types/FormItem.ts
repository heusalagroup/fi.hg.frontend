// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { FormFieldModel, isFormFieldModel} from "./FormFieldModel";
import { PageBreakModel, isPageBreakModel} from "./items/PageBreakModel";

export type FormItem = FormFieldModel | PageBreakModel;

export function isFormItem (value: any) : value is FormItem {
    return (
        isFormFieldModel(value)
        || isPageBreakModel(value)
    );
}

export function stringifyFormItem (value: FormItem): string {
    if ( !isFormItem(value) ) throw new TypeError(`Not FormItem: ${value}`);
    return `FormItem(${value})`;
}

export function parseFormItem (value: any): FormItem | undefined {
    if ( isFormItem(value) ) return value;
    return undefined;
}


