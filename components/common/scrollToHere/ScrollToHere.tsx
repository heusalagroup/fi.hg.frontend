// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useLayoutEffect, useRef } from "react";
import { BrowserOnly } from "../browserOnly/BrowserOnly";
import { LogService } from "../../../../core/LogService";
import { SCROLL_TO_HERE_DELAY } from "../../../constants/hgFrontend";
import { IfLocation } from "../ifLocation/IfLocation";

const LOG = LogService.createLogger('ScrollToHere');

/**
 * This method would print a warning on SSR React, so we use a useEffect workaround to remove that
 * warning. See the ScrollToHere() below.
 */
function BrowserOnlyScrollToHere () {

    const myRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(
        () => {

            if ( myRef?.current?.scrollIntoView !== undefined ) {

                LOG.debug(
                    `BrowserOnlyScrollToHere: Scrolling element to view after a delay: `,
                    myRef.current
                );

                const timeout = setTimeout(() => {
                    if ( myRef.current ) {
                        LOG.debug(
                            `BrowserOnlyScrollToHere: Scrolling element to view: `,
                            myRef.current
                        );
                        myRef.current.scrollIntoView(true);
                    }
                }, SCROLL_TO_HERE_DELAY);

                return () => {
                    if ( timeout !== undefined ) {
                        clearTimeout(timeout);
                    }
                };

            }

        },
        [
            myRef?.current?.scrollIntoView
        ]
    );

    return (
        <div ref={myRef} />
    );

}

/**
 * Scrolls to top when ever the route changes
 */
export function ScrollToHere (props: {path ?: string}) {

    return <BrowserOnly><IfLocation path={props?.path}><BrowserOnlyScrollToHere /></IfLocation></BrowserOnly>;

}
