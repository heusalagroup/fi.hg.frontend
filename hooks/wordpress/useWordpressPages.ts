// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { WordpressService } from "../../services/WordpressService";
import { useCallback, useEffect, useState} from "react";
import { WordpressPageDTO } from "../../../core/wordpress/dto/WordpressPageDTO";
import { LogService } from "../../../core/LogService";

const LOG = LogService.createLogger('useWordpressList');

export function useWordpressPagesList(url?, endpoint?):
    [
        readonly WordpressPageDTO[] | undefined,
    ] {
    const [pageList, setPageList] = useState<readonly WordpressPageDTO[] | undefined>(undefined);

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
            setPageList
        ]
    );


    // Update page list initially
    useEffect(
        () => {
            LOG.debug(`Initial update triggered`);
            getWordpressPagesCallback()
        },
        [
            getWordpressPagesCallback
        ]
    );

    return [pageList];
}