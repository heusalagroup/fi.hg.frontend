// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { WordpressService } from "../../services/WordpressService";
import {useCallback, useEffect, useState} from "react";
import { LogService } from "../../../core/LogService";
import { WordpressPageDTO } from "../../../core/wordpress/dto/WordpressPageDTO";
import { routeValidation } from "./routeValidation";

const LOG = LogService.createLogger('useWordpressPagesList');

export function useWordpressPagesList(url?:string, endpoint?:string, refresh?:boolean):
    [
            readonly WordpressPageDTO[] | undefined,
    ] {
    const [pageList, setPageList] = useState<readonly WordpressPageDTO[] | undefined>(undefined);
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

    const getWordpressPagesCallback = useCallback(
        async () => {
            try {
                LOG.debug(`Fetching pages list`);
                const result = await WordpressService.getWordpressPageList(url, endpoint);
                LOG.debug(`Received pages list: `, result);
                setPageList(result);
            } catch (err) {
                LOG.error(`Failed to load wordpress page list: `, err);
            }
        },
        [
            refreshCallback
        ]
    );


    // Update page list initially
    useEffect(
        () => {
            LOG.debug(`Initial update triggered`);
            refreshCallback()
            if(valid) {
                getWordpressPagesCallback()
            }
        },
        [
            refreshCallback,
            valid
        ]
    );

    return [pageList];
}