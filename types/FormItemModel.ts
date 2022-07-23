// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { FormItemType, isFormItemType} from "./FormItemType";

export interface FormItemModel {

    readonly type : FormItemType;

}

export function isFormItemModel (value: any) : value is FormItemModel {
    return (
        !!value && isFormItemType(value?.type)
    );
}

export function stringifyFormItemModel (value: FormItemModel): string {
    if ( !isFormItemModel(value) ) throw new TypeError(`Not FormItemModel: ${value}`);
    return `FormItemModel(${value})`;
}

export function parseFormItemModel (value: any): FormItemModel | undefined {
    if ( isFormItemModel(value) ) return value;
    return undefined;
}


