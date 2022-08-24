// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { WindowObjectService } from "../services/WindowObjectService";

export function useWindow () : Window | undefined {
    return WindowObjectService.getWindow();
}
