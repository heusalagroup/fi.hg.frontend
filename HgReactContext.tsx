// Copyright (c) 2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ReactNode, StrictMode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { useHelmetContext } from "./hooks/useHelmetContext";

export function HgReactContext (props : {children :ReactNode}) {
    const context = useHelmetContext();
    return (
        <StrictMode>
            <HelmetProvider context={context}>
                <BrowserRouter>{props?.children ?? ''}</BrowserRouter>
            </HelmetProvider>
        </StrictMode>
    );
}
