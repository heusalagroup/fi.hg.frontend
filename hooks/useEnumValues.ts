// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { EnumType } from "../../core/modules/lodash";
import { useEffect, useState } from "react";
import { EnumUtils } from "../../core/EnumUtils";

export function useEnumValues<T extends number|string> (
    type: EnumType<T>
) : readonly T[] {
    const [ list, setList ] = useState<readonly T[]>( () => EnumUtils.getValues<T>(type) );
    useEffect(
        () => {
            setList( () => EnumUtils.getValues<T>(type) );
        },
        [
            type,
            setList
        ]
    )
    return list;
}
