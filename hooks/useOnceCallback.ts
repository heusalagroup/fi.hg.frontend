// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useMemo } from "react";
import { once } from "lodash";

export function useOnceCallback (
    callback: any
) {
    return useMemo(
        () => once(callback),
        [
            callback
        ]
    );
}
