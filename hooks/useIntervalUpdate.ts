// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useEffect } from "react";
import { VoidCallback } from "../../core/interfaces/callbacks";
import { LogService } from "../../core/LogService";

const LOG = LogService.createLogger('useIntervalUpdate');

const DEFAULT_INTERVAL_TIME = 1000;

export function useIntervalUpdate (
    callback: VoidCallback,
    intervalTime : number = DEFAULT_INTERVAL_TIME
) {
    useEffect(
        () => {
            let updateInterval: any = setInterval(() => {
                LOG.debug(`Triggering callback`);
                callback();
            }, intervalTime);
            return () => {
                if ( updateInterval ) {
                    clearInterval(updateInterval);
                    updateInterval = undefined;
                }
            };
        }
    );
}
