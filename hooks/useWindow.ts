// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { WindowObjectService } from "../../core/WindowObjectService";
import { useEffect, useState } from "react";

/**
 * SSR safe use of window object
 */
export function useWindow () : Window | undefined {
    const [w, setW] = useState<Window | undefined>(undefined);
    useEffect(
        () => {
            const ww = WindowObjectService.getWindow();
            if (ww) {
                setW(ww);
            }
        },
        [
            setW
        ]
    );
    return w;
}
