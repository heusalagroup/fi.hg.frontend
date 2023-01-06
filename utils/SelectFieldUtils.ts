// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { EnumUtils, EnumObject } from "../../core/EnumUtils";
import { createSelectFieldItem, SelectFieldItem } from "../types/items/SelectFieldModel";
import { map } from "../../core/functions/map";

export interface CreateLabelCallback {
    (key: string) : string;
}

export class SelectFieldUtils {

    public static createFieldItemsFromValues<T> (
        obj          : EnumObject<T>,
        values       : readonly T[],
        createLabel ?: CreateLabelCallback
    ) : readonly SelectFieldItem<T>[] {
        const createLabelSafe : CreateLabelCallback = createLabel ? createLabel : ((key: string) : string => key);
        return map(
            EnumUtils.createFilteredKeysFromValues<T>(obj, values),
            (key : string) : SelectFieldItem<T> => createSelectFieldItem(createLabelSafe(key), obj[key])
        );
    }

    public static getEnumValues<T> (
        obj          : EnumObject<T>,
        createLabel ?: CreateLabelCallback
    ) : readonly SelectFieldItem<T>[] {
        const createLabelSafe : CreateLabelCallback = createLabel ? createLabel : ((key: string) : string => key);
        return map(
            EnumUtils.getKeys<T>(obj),
            (key : string) : SelectFieldItem<T> => createSelectFieldItem(createLabelSafe(key), obj[key])
        );
    }

}
