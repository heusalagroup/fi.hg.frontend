// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isString } from "../../core/types/String";

/**
 * If you add more fields, make sure to update ./FormFieldType.ts also.
 */
export enum FormItemType {

    // Fields
    TEXT_FIELD       = "text-field",
    COUNTRY_FIELD    = "text-field",
    PASSWORD_FIELD   = "password-field",
    EMAIL_FIELD      = "email-field",
    SELECT_FIELD     = "select-field",
    SLIDER_FIELD     = "slider-field",
    CHECKBOX_FIELD   = "checkbox-field",
    TEXT_AREA_FIELD  = "text-area-field",
    JSON_FIELD       = "json-field",
    INTEGER_FIELD    = "integer-field",
    DATE_FIELD       = "date-field",

    // Non-fields
    PAGE_BREAK = "page-break"

}

export function isFormItemType (value: any) : value is FormItemType {

    if (!isString(value)) return false;

    switch (value) {

        case FormItemType.TEXT_FIELD:
        case FormItemType.COUNTRY_FIELD:
        case FormItemType.PASSWORD_FIELD:
        case FormItemType.EMAIL_FIELD:
        case FormItemType.CHECKBOX_FIELD:
        case FormItemType.TEXT_AREA_FIELD:
        case FormItemType.INTEGER_FIELD:
        case FormItemType.DATE_FIELD:
        case FormItemType.PAGE_BREAK:
            return true;

        default: return false;
    }

}

export function stringifyFormItemType (value: FormItemType): string {
    if ( !isFormItemType(value) ) throw new TypeError(`Not FormItemType: ${value}`);
    return `FormItemType(${value})`;
}

export function parseFormItemType (value: any): FormItemType | undefined {
    if ( isFormItemType(value) ) return value;
    return undefined;
}


