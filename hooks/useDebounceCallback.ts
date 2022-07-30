// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useMemo } from "react";
import { debounce } from "lodash";

export function useDebounceCallback (
    callback: any,
    time: number
) {
    return useMemo(
        () => debounce(
            callback,
            time
        ),
        [
            callback,
            time
        ]
    );
}
