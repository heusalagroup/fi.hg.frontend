// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useEffect, useState } from "react";
import { LogService } from "../../core/LogService";
import { useWindow } from "./useWindow";

const LOG = LogService.createLogger('useWindowSize');

export function useScrollTop (
    scrollingElement: Element | null | undefined
) : number | undefined {

    const w = useWindow();

    const [ scrollTop, setScrollTop ] = useState<number | undefined>(
        scrollingElement?.scrollTop
    );

    const onScroll = useCallback(
        () => {
            LOG.debug(`Scrolling detected on `, scrollingElement);
            setScrollTop( () => scrollingElement?.scrollTop );
        },
        [
            setScrollTop,
            scrollingElement
        ]
    );

    useEffect(
        () => {
            LOG.debug(`Listening scroll events...`);
            setScrollTop(scrollingElement?.scrollTop);
            if (w) {
                w.addEventListener('scroll', onScroll);
                return () => {
                    w.removeEventListener('scroll', onScroll);
                };
            } else {
                LOG.warn(`Could not detect window object. Cannot listen scroll events.`);
            }
        },
        [
            setScrollTop,
            scrollingElement,
            onScroll,
            w
        ]
    );
    return scrollTop;
}
