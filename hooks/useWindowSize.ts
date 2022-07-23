// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useEffect, useState } from "react";
import { WindowSizeService, WindowSizeServiceEvent } from "../services/WindowSizeService";
import { LogService } from "../../core/LogService";

const LOG = LogService.createLogger('useWindowSize');

export interface WindowSize {
    readonly height: number | undefined;
    readonly width: number | undefined;
}

export function useWindowSize () {

    const [ windowSize, setWindowSize ] = useState<WindowSize>(
        {
            width: WindowSizeService.getWidth(),
            height: WindowSizeService.getHeight()
        }
    );

    useEffect(
        () => {

            LOG.debug(`Listening WindowSizeService for resize events...`);

            // This makes sure that window size is updated also when served from server through SSR
            // Also probably fixes issues when window size changes while initial loading is on going.
            setWindowSize(
                {
                    width: WindowSizeService.getWidth(),
                    height: WindowSizeService.getHeight()
                }
            );

            return WindowSizeService.on(WindowSizeServiceEvent.RESIZED, () => {
                LOG.debug(`Listening WindowSizeService RESIZED event triggered`);
                setWindowSize(
                    {
                        width: WindowSizeService.getWidth(),
                        height: WindowSizeService.getHeight()
                    }
                );
            });

        },
        [
            setWindowSize
        ]
    );

    return windowSize;

}
