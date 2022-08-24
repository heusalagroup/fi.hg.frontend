// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { WindowObjectService } from "../../core/WindowObjectService";
import { useEffect, useState } from "react";
import { LogService } from "../../core/LogService";

const LOG = LogService.createLogger('useWindow');

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
            } else {
                LOG.warn(`Warning! Could not find window element.`);
            }
        },
        [
            setW
        ]
    );
    return w;
}
