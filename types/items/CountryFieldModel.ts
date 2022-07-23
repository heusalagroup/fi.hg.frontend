// Copyright (c) 2022. Heusala Group Oy <info@hg.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { FormItemType } from "../FormItemType";
import { FormFieldModel,  isFormFieldModel } from "../FormFieldModel";

export interface CountryFieldModel extends FormFieldModel {
    readonly type         : FormItemType.COUNTRY_FIELD;
}

export function isCountryFieldModel (value: any) : value is CountryFieldModel {
    return value?.type === FormItemType.COUNTRY_FIELD && isFormFieldModel(value);
}

export function stringifyCountryFieldModel (value: CountryFieldModel): string {
    if ( !isCountryFieldModel(value) ) throw new TypeError(`Not CountryFieldModel: ${value}`);
    return `CountryFieldModel(${value})`;
}

export function parseCountryFieldModel (value: any): CountryFieldModel | undefined {
    if ( isCountryFieldModel(value) ) return value;
    return undefined;
}


