// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { WpService } from "../../services/WpService";
import { useCallback, useEffect, useState } from "react";
import { LogService } from "../../../core/LogService";
import { WpPageDTO } from "../../../core/wordpress/dto/WpPageDTO";
import { endsWith } from "../../../core/functions/endsWith";

const LOG = LogService.createLogger('useWpPageList');

export function useWpPageList (url: string):
    [
            readonly WpPageDTO[] | undefined,
    ] {

    const urlIsValid : boolean = !endsWith(url, '/');

    const [list, setList] = useState<readonly WpPageDTO[] | undefined>(undefined);

    const getWpPagesCallback = useCallback(
        async () => {
            try {
                LOG.debug(`Fetching pages list`);
                const result = await WpService.getWpPageList(url);
                LOG.debug(`Received pages list: `, result);
                setList(result);
            } catch (err) {
                LOG.error(`Failed to load wordpress page list: `, err);
            }
        },
        [
            url
        ]
    );

    // Update page list initially
    useEffect(
        () => {
            LOG.debug(`Initial update triggered`);
            if (urlIsValid) {
                getWpPagesCallback()
            }
        },
        [
            urlIsValid,
            getWpPagesCallback
        ]
    );

    return [list];
}