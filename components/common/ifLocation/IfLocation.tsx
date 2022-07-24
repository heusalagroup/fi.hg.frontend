// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

export interface IfLocationProps {
    readonly path     ?: string;
    readonly children  : ReactNode;
}

/**
 * Render children only if location path matches
 */
export function IfLocation (props: IfLocationProps) {
    const targetPath = props?.path;
    const location = useLocation();
    const currentPath = location?.pathname;
    return (
        <>{targetPath !== undefined && currentPath === targetPath ? props.children : null}</>
    );
}
