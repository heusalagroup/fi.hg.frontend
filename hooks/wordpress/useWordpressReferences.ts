// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { WordpressService } from "../../services/WordpressService";
import {useCallback, useEffect, useState} from "react";
import { LogService } from "../../../core/LogService";
import { WordpressReferenceDTO } from "../../../core/wordpress/dto/WordpressReferenceDTO";
import { routeValidation } from "./routeValidation";

const LOG = LogService.createLogger('useWordpressReferencesList');

export function useWordpressReferencesList(url?:string, endpoint?:string):
    [
            readonly WordpressReferenceDTO[] | undefined,
    ] {
    const [referencesList, setReferenceList] = useState<readonly WordpressReferenceDTO[] | undefined>(undefined);
    const [valid, setValid] = useState<boolean>(false);

    const refreshCallback = useCallback(
        () => {
            const result = routeValidation(url, endpoint);
            setValid(result);
        },
        [
            url,
            endpoint
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
            refreshCallback
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
            valid
        ]
    );

    const onChangeCallback = useCallback(
        () => {
            setValid(false)
        },
        []
    );

    return [
        referencesList,
        onChangeCallback,];
}