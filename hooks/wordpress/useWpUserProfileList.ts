// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { WpService } from "../../services/WpService";
import { useCallback, useEffect, useState } from "react";
import { LogService } from "../../../core/LogService";
import { WpUserProfileDTO } from "../../../core/wordpress/dto/WpUserProfileDTO";
import { endsWith } from "../../../core/functions/endsWith";

const LOG = LogService.createLogger('useWpUserProfileList');

export function useWpUserProfileList (url:string):
    [
            readonly WpUserProfileDTO[] | undefined,
    ] {
    const urlIsValid : boolean = !endsWith(url, '/');
    const [list, setList] = useState<readonly WpUserProfileDTO[] | undefined>(undefined);

    const getWpUserProfilesCallback = useCallback(
        async () => {
            try {
                LOG.debug(`Fetching user profiles list`);
                const result = await WpService.getWpUserProfileList(url);
                LOG.debug(`Received user profiles list: `, result);
                setList(result);
            } catch (err) {
                LOG.error(`Failed to load wordpress user profiles list: `, err);
            }
        },
        [
            url
        ]
    );

    // Update profiles list initially
    useEffect(
        () => {
            LOG.debug(`Initial update triggered`);
            if(urlIsValid) {
                getWpUserProfilesCallback()
            }
        },
        [
            urlIsValid,
            getWpUserProfilesCallback
        ]
    );

    return [list];
}