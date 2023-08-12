// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import REACT_ROUTER_DOM from "react-router-dom";
import { useCallback, useEffect } from "react";
import { RouteService, RouteServiceEvent } from "../services/RouteService";
import { LogService } from "../../core/LogService";

const LOG = LogService.createLogger('useRouteService');

export function useRouteService () {

    const hasNavigate: boolean = !!((REACT_ROUTER_DOM as any)?.useNavigate);
    const useNavigate = hasNavigate ? (REACT_ROUTER_DOM as any)?.useNavigate : (() => null);

    const hasHistory: boolean = !!((REACT_ROUTER_DOM as any)?.useHistory);
    const useHistory = hasHistory ? (REACT_ROUTER_DOM as any)?.useHistory : (() => null);

    const history = useHistory();
    const navigate = useNavigate();

    const pushRoute = useCallback(
        (route: string) => {
            if ( hasHistory ) {
                history.push(route);
            } else if ( hasNavigate ) {
                navigate.push(route);
            } else {
                LOG.warn(`Module react-router-dom did not have useNavigate nor useHistory`);
            }
        },
        [
            hasHistory,
            history,
            hasNavigate,
            navigate
        ]
    );

    useEffect(
        () => {

            const prevRoute = RouteService.getNextHistory();

            if ( prevRoute ) {
                pushRoute(prevRoute);
            }

            return RouteService.on(
                RouteServiceEvent.PUSH_HISTORY,
                (
                    // @ts-ignore @todo why unused?
                    eventName,
                    routeName: string
                ) => {
                    pushRoute(routeName);
                }
            );

        },
        [
            pushRoute
        ]
    );

}
