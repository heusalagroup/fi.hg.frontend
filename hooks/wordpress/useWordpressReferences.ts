// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { WordpressService } from "../../services/WordpressService";
import {useCallback, useEffect, useState} from "react";
import { LogService } from "../../../core/LogService";
import { WpReferenceDTO } from "../../../core/wordpress/dto/WpReferenceDTO";
import { routeValidation } from "./routeValidation";

const LOG = LogService.createLogger('useWordpressReferencesList');

export function useWordpressReferencesList(url:string):
    [
            readonly WpReferenceDTO[] | undefined,
    ] {
    const [referencesList, setReferenceList] = useState<readonly WpReferenceDTO[] | undefined>(undefined);
    const [valid, setValid] = useState<boolean>(false);


    const refreshCallback = useCallback(
        () => {
            const result = routeValidation(url);
            setValid(result);
        },
        [
            url,
        ]
    )
    const getWordpressReferencesCallback = useCallback(
        async () => {
            try {
                LOG.debug(`Fetching references list`);
                const result = await WordpressService.getWordpressReferenceList(url);
                LOG.debug(`Received references list: `, result);
                setReferenceList(result);
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
            refreshCallback()
            if(valid) {
                getWordpressReferencesCallback()
            }
        },
        [
            refreshCallback,
            valid,
            getWordpressReferencesCallback
        ]
    );

    return [referencesList];
}