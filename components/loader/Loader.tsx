// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2020-2021 Sendanor. All rights reserved.

import { ReactComponent as LoadingIcon } from "./loading.svg";
import { LOADER_CLASS_NAME } from "../../constants/hgClassName";
import { useCallback, useState } from "react";
import { useDelayedCallback } from "../../hooks/useDelayedCallback";
import { useMountEffect } from "../../hooks/useMountEffect";
import "./Loader.scss";

const DEFAULT_LOADER_SPEED = 1.6;
const DEFAULT_HIDDEN_TIME = 500;

export interface LoaderProps {

    readonly className?: string;
    readonly speed?: number;

    /**
     * Time in milliseconds until the loader will be displayed to the user
     */
    readonly hiddenTime?: number;

}

/**
 * Loader component.
 */
export function Loader (props: LoaderProps) {
    const className = props?.className;
    const speed = props?.speed ?? DEFAULT_LOADER_SPEED;
    const hiddenTime = props?.hiddenTime ?? DEFAULT_HIDDEN_TIME;
    const [hidden, setHidden] = useState<boolean>( (hiddenTime ?? -1) >= 0 );
    const setVisibleCallback = useCallback(
        () => {
            setHidden(false);
        },
        [
            setHidden
        ]
    );
    const [delayedSetVisibleCallback, cancelDelayedSetVisibleCallback] = useDelayedCallback(
        setVisibleCallback,
        hiddenTime > 0 ? hiddenTime : 0
    );
    useMountEffect(
        'Loader',
        delayedSetVisibleCallback,
        cancelDelayedSetVisibleCallback
    );
    return (
        <div className={
            LOADER_CLASS_NAME
            + (className ? ` ${className}` : '')
        }>
            <div className={LOADER_CLASS_NAME + '-icon-container'}
                 style={{animation: `spin ${speed}s linear infinite`}}
            >{hidden ? null : <LoadingIcon />}</div>
        </div>
    );
}
