// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useState, SetStateAction , Dispatch } from "react";
import { Theme } from "../../core/types/Theme";

export type SetThemeCallback = Dispatch<SetStateAction<Theme>>;

export function useTheme (initialState: Theme = Theme.LIGHT) : [Theme, SetThemeCallback] {
    return useState<Theme>(initialState);
}
