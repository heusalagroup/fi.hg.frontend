// Copyright (c) 2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { WordpressService } from "../../services/WordpressService";
import {useCallback, useEffect, useState} from "react";
import { LogService } from "../../../core/LogService";
import { WordpressPostDTO } from "../../../core/wordpress/dto/WordpressPostDTO";
import { routeValidation } from "./routeValidation";

const LOG = LogService.createLogger('useWordpressPosts');

export function useWordpressPostsList(url:string):
    [
            readonly WordpressPostDTO[] | undefined,
    ] {
    const [postList, setPostList] = useState<readonly WordpressPostDTO[] | undefined>(undefined);
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

    const getWordpressPostsCallback = useCallback(
        async () => {
            try {
                LOG.debug(`Fetching post list (as page list)`);
                const result = await WordpressService.getWordpressPostList(url);
                LOG.debug(`Received pages list (as post list): `, result);
                setPostList(result);
            } catch (err) {
                LOG.error(`Failed to load wordpress page list (as post list): `, err);
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
                getWordpressPostsCallback()
            }
        },
        [
            refreshCallback,
            valid,
            getWordpressPostsCallback
        ]
    );

    return [postList];
}