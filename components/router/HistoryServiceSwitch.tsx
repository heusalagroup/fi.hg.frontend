// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import REACT_ROUTER_DOM from "react-router-dom";
import { useCallback, useEffect } from "react";
import { RouteService,  RouteServiceEvent } from "../../services/RouteService";
import { LogService } from "../../../core/LogService";

const LOG = LogService.createLogger('HistoryServiceSwitch');

/**
 * Enables `RouteService.setRoute()` functionality with react-router-dom's switch.
 *
 * @param props
 * @constructor
 */
export function HistoryServiceSwitch (props: {children: any}): any {

    const hasNavigate : boolean = !!((REACT_ROUTER_DOM as any)?.useNavigate);
    const hasHistory  : boolean = !!((REACT_ROUTER_DOM as any)?.useHistory);
    const hasSwitch   : boolean = !!((REACT_ROUTER_DOM as any)?.Switch);

    const useNavigate = hasNavigate ? (REACT_ROUTER_DOM as any)?.useNavigate : (() => null);
    const useHistory  = hasHistory  ? (REACT_ROUTER_DOM as any)?.useHistory  : (() => null);
    const Switch      = hasSwitch   ? (REACT_ROUTER_DOM as any)?.Switch      : null;

    const history = useHistory();
    const navigate = useNavigate();

    const pushRoute = useCallback((route: string) => {
        if (hasHistory) {
            history.push(route);
        } else if (hasNavigate) {
            navigate.push(route);
        } else {
            LOG.warn(`Module react-router-dom did not have useNavigate nor useHistory`);
        }
    }, [
                                      hasHistory,
                                      history,
                                      hasNavigate,
                                      navigate
                                  ] );

    useEffect(
        () => {

            const prevRoute = RouteService.getNextHistory();

            if ( prevRoute ) {
                pushRoute(prevRoute);
            }

            return RouteService.on(
                RouteServiceEvent.PUSH_HISTORY,
                (
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

    if (!Switch) {
        return <>{props.children}</>;
    } else {
        return (
            <Switch>{props.children}</Switch>
        );
    }

}


