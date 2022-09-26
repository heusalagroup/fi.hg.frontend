// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { WordpressService } from "../../services/WordpressService";
import { useCallback, useEffect, useState } from "react";
import { LogService } from "../../../core/LogService";
import { WordpressUserProfileDTO } from "../../../core/wordpress/dto/WordpressUserProfileDTO";

const LOG = LogService.createLogger('useWordpressList');

export function useWordpressProfilesList(url?, endpoint?):
    [
            readonly WordpressUserProfileDTO[] | undefined,
    ] {
    const [userProfilesList, setUserProfilesList] = useState<readonly WordpressUserProfileDTO[] | undefined>(undefined);


    const getWordpressUserProfilesCallback = useCallback(
        async () => {
            try {
                LOG.debug(`Fetching user profiles list`);
                const result = await WordpressService.getWordpressUserProfilesList(url, endpoint);
                LOG.debug(`Received user profiles list: `, result);
                setUserProfilesList(result);
            } catch (err) {
                LOG.error(`Failed to load wordpress user profiles list: `, err);
            }
        },
        [
            setUserProfilesList,
        ]
    );


    // Update reference list initially
    useEffect(
        () => {
            LOG.debug(`Initial update triggered`);
            getWordpressUserProfilesCallback()
        },
        [
            getWordpressUserProfilesCallback
        ]
    );


    return [userProfilesList];
}