// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { FormItemType } from "../FormItemType";
import { FormItemModel } from "../FormItemModel";
import { isStringOrUndefined } from "../../../core/types/String";

export interface PageBreakModel extends FormItemModel {

    readonly type        : FormItemType.PAGE_BREAK;
    readonly backLabel  ?: string;
    readonly nextLabel  ?: string;

}

export function isPageBreakModel (value: any) : value is PageBreakModel {
    return (
        !!value
        && value?.type === FormItemType.PAGE_BREAK
        && isStringOrUndefined(value?.backLabel)
        && isStringOrUndefined(value?.nextLabel)
    );
}

export function stringifyPageBreakModel (value: PageBreakModel): string {
    if ( !isPageBreakModel(value) ) throw new TypeError(`Not PageBreakModel: ${value}`);
    return `PageBreakModel(${value})`;
}

export function parsePageBreakModel (value: any): PageBreakModel | undefined {
    if ( isPageBreakModel(value) ) return value;
    return undefined;
}


