// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { useCallback, useEffect } from "react";
import { RouteService, RouteServiceEvent } from "../services/RouteService";
import { useNavigate } from "react-router-dom";
import { LogService } from "../../core/LogService";

const LOG = LogService.createLogger('useRouteServiceWithNavigate');

/**
 * See `useRouteServiceLegacy()` if you need old support.
 */
export function useRouteServiceWithNavigate () {

    const navigate = useNavigate();

    const navigateWithLogging = useCallback(
        (routeName : string) => {
            LOG.debug(`Navigating to `, routeName);
            navigate(routeName);
        },
        [
            navigate
        ]
    );

    const onEventCallback = useCallback(
        (
            // @ts-ignore @todo why unused?
            eventName : RouteServiceEvent,
            routeName : string
        ) => {
            navigateWithLogging(routeName);
        },
        [
            navigateWithLogging
        ]
    );

    useEffect(
        () => {
            const prevRoute = RouteService.getNextHistory();
            if ( prevRoute ) {
                navigateWithLogging(prevRoute);
            }
            return RouteService.on(
                RouteServiceEvent.PUSH_HISTORY,
                onEventCallback
            );
        },
        [
            navigateWithLogging,
            onEventCallback
        ]
    );

}
