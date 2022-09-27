// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { WordpressService } from "../../services/WordpressService";
import {useCallback, useEffect, useState} from "react";
import { LogService } from "../../../core/LogService";
import { WordpressUserProfileDTO } from "../../../core/wordpress/dto/WordpressUserProfileDTO";
import { routeValidation } from "./routeValidation";

const LOG = LogService.createLogger('useWordpressProfilesList');

export function useWordpressProfilesList(url?:string, endpoint?:string, refresh?:boolean):
    [
            readonly WordpressUserProfileDTO[] | undefined,
    ] {
    const [userProfilesList, setUserProfilesList] = useState<readonly WordpressUserProfileDTO[] | undefined>(undefined);
    const [valid, setValid] = useState<boolean>(false);

    const refreshCallback = useCallback(
        () => {
            const result = routeValidation(url, endpoint);
            setValid(result);
        },
        [
            url,
            endpoint,
            refresh
        ]
    )

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
            refreshCallback
        ]
    );

    // Update profiles list initially
    useEffect(
        () => {
            LOG.debug(`Initial update triggered`);
            refreshCallback()
            if(valid) {
                getWordpressUserProfilesCallback()
            }
        },
        [
            refreshCallback,
            valid
        ]
    );


    return [userProfilesList];
}