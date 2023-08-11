// Copyright (c) 2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ReactNode, StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";

export function HgReactContext (props : {children :ReactNode}) {
    return (
        <StrictMode>
            <BrowserRouter>{props?.children ?? ''}</BrowserRouter>
        </StrictMode>
    );
}
