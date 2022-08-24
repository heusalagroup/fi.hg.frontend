// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useWindow } from "./useWindow";

export function useDocument () : Document | undefined {
    const w = useWindow();
    return w?.document;
}
