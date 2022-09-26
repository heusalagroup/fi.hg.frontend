// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { WordpressService } from "../../services/WordpressService";
import { useCallback, useEffect, useState } from "react";
import { LogService } from "../../../core/LogService";
import { WordpressReferenceDTO } from "../../../core/wordpress/dto/WordpressReferenceDTO";

const LOG = LogService.createLogger('useWordpressList');

export function useWordpressReferencesList(url?, endpoint?):
    [
            readonly WordpressReferenceDTO[] | undefined,
    ] {
    const [referencesList, setReferenceList] = useState<readonly WordpressReferenceDTO[] | undefined>(undefined);


    const getWordpressReferencesCallback = useCallback(
        async () => {
            try {
                LOG.debug(`Fetching references list`);
                const result = await WordpressService.getWordpressReferenceList(url, endpoint);
                LOG.debug(`Received references list: `, result);
                setReferenceList(result);
            } catch (err) {
                LOG.error(`Failed to load wordpress references list: `, err);
            }
        },
        [
            setReferenceList
        ]
    );


    // Update reference list initially
    useEffect(
        () => {
            LOG.debug(`Initial update triggered`);
            getWordpressReferencesCallback()
        },
        [
            getWordpressReferencesCallback
        ]
    );

    return [referencesList];
}