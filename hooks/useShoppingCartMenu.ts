// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useEffect, useState } from "react";
import { StoreCartService } from "../../core/StoreCartService";
import { LogService } from "../../core/LogService";
import { useWindowSizeChange } from "./useWindowSizeChange";
import { useLocationChange } from "./useLocationChange";
import { useScrollTopChange } from "./useScrollTopChange";
import { VoidCallback } from "../../core/interfaces/callbacks";

const LOG = LogService.createLogger('useShoppingCartMenu');

export function useShoppingCartMenu (
    context: string
): [ boolean, VoidCallback, VoidCallback ] {

    const [ isMenuOpen, setMenuOpen ] = useState<boolean>(StoreCartService.isCartMenuOpen());

    const closeMenuCallback = useCallback(
        () => {
            LOG.debug(`${context}: Closing cart menu since window size changed`);
            StoreCartService.closeCartMenu();
        },
        [
            context
        ]
    );

    const toggleMenuCallback = useCallback(
        () => {
            StoreCartService.toggleCartMenu();
        },
        []
    );

    // When window size changes, close menu
    useWindowSizeChange(`${context}.useShoppingCartMenu`, closeMenuCallback);

    // When location changes, close menu
    useLocationChange(`${context}.useShoppingCartMenu`, closeMenuCallback);

    // When scroll changes
    useScrollTopChange(`${context}.useShoppingCartMenu`, closeMenuCallback);

    // Detect when state in SendanorCartService changes
    useEffect(
        () => {
            setMenuOpen(() => StoreCartService.isCartMenuOpen());
            return StoreCartService.on(
                StoreCartService.Event.CART_MENU_UPDATED,
                () => {
                    setMenuOpen(() => StoreCartService.isCartMenuOpen());
                }
            );
        },
        [
            setMenuOpen
        ]
    );

    return [ isMenuOpen, toggleMenuCallback, closeMenuCallback ];
}
