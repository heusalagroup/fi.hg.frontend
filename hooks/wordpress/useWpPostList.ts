// Copyright (c) 2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { WpService } from "../../services/WpService";
import { useCallback, useEffect, useState } from "react";
import { LogService } from "../../../core/LogService";
import { WpPostDTO } from "../../../core/wordpress/dto/WpPostDTO";
import { endsWith } from "../../../core/functions/endsWith";

const LOG = LogService.createLogger('useWpPostList');

export function useWpPostList (url:string):
    [
            readonly WpPostDTO[] | undefined,
    ] {

    const urlIsValid : boolean = !endsWith(url, '/');
    const [list, setList] = useState<readonly WpPostDTO[] | undefined>(undefined);

    const getWpPostsCallback = useCallback(
        async () => {
            try {
                LOG.debug(`Fetching post list (as page list)`);
                const result = await WpService.getWpPostList(url);
                LOG.debug(`Received pages list (as post list): `, result);
                setList(result);
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
            if(urlIsValid) {
                getWpPostsCallback()
            }
        },
        [
            urlIsValid,
            getWpPostsCallback
        ]
    );

    return [list];
}