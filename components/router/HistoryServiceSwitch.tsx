// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import REACT_ROUTER_DOM from "react-router-dom";
import { useRouteServiceWithNavigate } from "../../hooks/useRouteServiceWithNavigate";

/**
 * Enables `RouteService.setRoute()` functionality with react-router-dom's switch.
 *
 * @param props
 * @constructor
 */
export function HistoryServiceSwitch (props: {children: any}): any {
    useRouteServiceWithNavigate();
    const hasSwitch: boolean = !!((REACT_ROUTER_DOM as any)?.Switch);
    const Switch = hasSwitch ? (REACT_ROUTER_DOM as any)?.Switch : null;
    if ( !Switch ) {
        return <>{props.children}</>;
    } else {
        return (
            <Switch>{props.children}</Switch>
        );
    }
}
