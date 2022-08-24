// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ReactNode, useEffect, useState } from "react";

/**
 * Prints child elements only in the browser context, e.g. not in the initial server side SSR.
 */
export function BrowserOnly (props: {children: ReactNode}) {
    const [showChild, setShowChild] = useState<boolean>(false);
    useEffect(
        () => {
            setShowChild(true);
        },
        []
    );
    return <>{showChild ? props.children : null}</>;
}
