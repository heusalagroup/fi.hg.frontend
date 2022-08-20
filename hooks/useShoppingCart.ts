// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useState } from "react";
import { ShoppingCart } from "../../core/store/types/cart/ShoppingCart";
import { StoreCartService } from "../../core/StoreCartService";
import { VoidCallback } from "../../core/interfaces/callbacks";

export function useShoppingCart () : [ShoppingCart, VoidCallback] {
    const [ cart, setCart ] = useState<ShoppingCart>(StoreCartService.getCart() );
    const updateCart = useCallback(
        () => {
            setCart(StoreCartService.getCart() );
        },
        [
            setCart
        ]
    );
    return [cart, updateCart];
}
