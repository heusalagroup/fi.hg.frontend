// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useEffect, useState } from "react";
import { EnumUtils } from "../../core/EnumUtils";
import {Enum} from "../../core/types/Enum";

export function useEnumValues<T extends number|string> (
    type: Enum<T>
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
