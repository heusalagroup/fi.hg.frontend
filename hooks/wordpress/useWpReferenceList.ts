// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { WpService } from "../../services/WpService";
import { useCallback, useEffect, useState } from "react";
import { LogService } from "../../../core/LogService";
import { WpReferenceDTO } from "../../../core/wordpress/dto/WpReferenceDTO";
import { endsWith } from "../../../core/functions/endsWith";

const LOG = LogService.createLogger('useWpReferenceList');

export function useWpReferenceList (url:string):
    [
            readonly WpReferenceDTO[] | undefined,
    ] {

    const urlIsValid : boolean = !endsWith(url, '/');
    const [list, setList] = useState<readonly WpReferenceDTO[] | undefined>(undefined);

    const getWordpressReferencesCallback = useCallback(
        async () => {
            try {
                LOG.debug(`Fetching references list`);
                const result = await WpService.getWpReferenceList(url);
                LOG.debug(`Received references list: `, result);
                setList(result);
            } catch (err) {
                LOG.error(`Failed to load wordpress references list: `, err);
            }
        },
        [
            url,
        ]
    );

    // Update reference list initially
    useEffect(
        () => {
            LOG.debug(`Initial update triggered`);
            if(urlIsValid) {
                getWordpressReferencesCallback()
            }
        },
        [
            urlIsValid,
            getWordpressReferencesCallback
        ]
    );

    return [list];
}