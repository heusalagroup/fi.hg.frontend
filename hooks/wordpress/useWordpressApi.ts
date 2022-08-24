// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import {WordpressService} from "../../services/WordpressService";
import {useCallback, useEffect, useState, Dispatch, SetStateAction} from "react";
import {WordpressPageDTO} from "../../../core/wordpress/dto/WordpressPageDTO";
import {LogService} from "../../../core/LogService";

const LOG = LogService.createLogger('useWordpressList');

export function useWordpressList():
    [
            readonly WordpressPageDTO[] | undefined,
        Dispatch<SetStateAction<WordpressPageDTO>>,
        Dispatch<SetStateAction<boolean>>
    ] {
    const [list, setList] = useState<readonly WordpressPageDTO[] | undefined>(undefined);
    const [data, setData] = useState<WordpressPageDTO | undefined>(undefined);
    const [postData, setPostData] = useState(false);

    const validatePostData = useCallback(
        () => {
            // Feel free to add more fields
            const {content, title} = data;
            if (content && title) {
                LOG.debug('Content is valid for Wordpress')
                return true
            } else {
                LOG.debug('Content is not valid for Wordpress')
                return false
            }
        },
        [
            setData
        ]
    )

    const postWordpressPageCallback = useCallback(
        async () => {
            if (validatePostData()) {
                LOG.debug('Posting data in hook');
                try {
                    LOG.debug(`Posting page`);
                    const result = await WordpressService.postWordpressPage(data);
                    LOG.debug(`Posted page: `, result);
                    setData(result);
                    setPostData(false)
                } catch (err) {
                    LOG.error(`Failed to post wordpress page : `, err);
                }
            }

        },
        [
            setData
        ]
    )

    const getWordpressPagesCallback = useCallback(
        async () => {
            try {
                LOG.debug(`Fetching list`);
                const result = await WordpressService.getMyWordpressPageList();
                LOG.debug(`Received list: `, result);
                setList(result);
            } catch (err) {
                LOG.error(`Failed to load wordpress page list: `, err);
            }
        },
        [
            setList
        ]
    );

    // Update list initially
    useEffect(
        () => {
            LOG.debug(`Initial update triggered`);
            getWordpressPagesCallback();
        },
        [
            getWordpressPagesCallback
        ]
    );

    // Post data
    useEffect(
        () => {
            LOG.debug(`Page post triggered`);
            postWordpressPageCallback();
        },
        [
            postData
        ]
    );

    return [list, setData, setPostData];

}