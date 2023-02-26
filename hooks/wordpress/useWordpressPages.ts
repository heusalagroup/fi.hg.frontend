// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { WordpressService } from "../../services/WordpressService";
import {useCallback, useEffect, useState} from "react";
import { LogService } from "../../../core/LogService";
import { WpPageDTO } from "../../../core/wordpress/dto/WpPageDTO";
import { routeValidation } from "./routeValidation";

const LOG = LogService.createLogger('useWordpressPagesList');

export function useWordpressPagesList(url:string):
    [
            readonly WpPageDTO[] | undefined,
    ] {
    const [pageList, setPageList] = useState<readonly WpPageDTO[] | undefined>(undefined);
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

    const getWordpressPagesCallback = useCallback(
        async () => {
            try {
                LOG.debug(`Fetching pages list`);
                const result = await WordpressService.getWordpressPageList(url);
                LOG.debug(`Received pages list: `, result);
                setPageList(result);
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
            refreshCallback()
            if(valid) {
                getWordpressPagesCallback()
            }
        },
        [
            refreshCallback,
            valid,
            getWordpressPagesCallback
        ]
    );

    return [pageList];
}